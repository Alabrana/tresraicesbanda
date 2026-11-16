import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { basename, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bandSchema, collaboratorsSchema, gallerySchema, identifierSchema, mediaSchema, networkSchema, newsSchema, showSchema, siteSchema } from '../src/lib/contracts.ts';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PUBLIC_IMAGES = resolve(ROOT, 'public/images');
const EDITOR_PUBLIC = resolve(ROOT, 'editor/public');
const TRANSACTIONS = resolve(ROOT, 'editor/.transactions');
const DATA_FILES = { band: 'src/data/band.json', media: 'src/data/media.json', gallery: 'src/data/gallery.json', network: 'src/data/network.json', collaborators: 'src/data/collaborators.json', site: 'src/data/site.json' };
const DATA_SCHEMAS = { band: bandSchema, media: mediaSchema, gallery: gallerySchema, network: networkSchema, collaborators: collaboratorsSchema, site: siteSchema };
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const MIME_TYPES = { '.avif': 'image/avif', '.gif': 'image/gif', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

const hash = (value) => createHash('sha256').update(value).digest('hex');
const toJson = (value) => `${JSON.stringify(value, null, 2)}\n`;
function isInside(parent, target) { const path = relative(parent, target); return path !== '' && path !== '..' && !path.startsWith(`..${sep}`) && !path.startsWith('..'); }
function validationError(error) { return error.issues.map((issue) => `${issue.path.join('.') || 'contenido'}: ${issue.message}`).join('\n'); }
function parseScalar(value) { const trimmed = value.trim(); return trimmed.startsWith('"') || trimmed.startsWith('[') || trimmed.startsWith('{') ? JSON.parse(trimmed) : trimmed; }

export function parseNews(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('La noticia debe comenzar con frontmatter YAML delimitado por ---.');
  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator <= 0) throw new Error(`Frontmatter inválido: ${line}`);
    frontmatter[line.slice(0, separator).trim()] = parseScalar(line.slice(separator + 1));
  }
  return { frontmatter, body: match[2].replace(/^\r?\n/, '') };
}

export function serializeNews({ frontmatter, body }) {
  return `---\n${Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n${body.trim()}\n`;
}

async function listImageFiles(directory = PUBLIC_IMAGES) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listImageFiles(full));
    else if (entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) files.push(`/images/${relative(PUBLIC_IMAGES, full).split(sep).join('/')}`);
  }
  return files.sort((left, right) => left.localeCompare(right));
}

async function readText(path) { return readFile(resolve(ROOT, path), 'utf8'); }

export async function loadSnapshot() {
  const data = {}; const raw = {};
  for (const [key, path] of Object.entries(DATA_FILES)) { raw[path] = await readText(path); data[key] = JSON.parse(raw[path]); }
  const news = {}; const shows = {};
  for (const [kind, directory] of [['news', 'src/content/news'], ['shows', 'src/content/shows']]) {
    for (const entry of await readdir(resolve(ROOT, directory), { withFileTypes: true })) {
      if (!entry.isFile() || (kind === 'news' ? extname(entry.name) !== '.md' : extname(entry.name) !== '.json')) continue;
      const path = `${directory}/${entry.name}`; raw[path] = await readText(path);
      const id = basename(entry.name, extname(entry.name));
      if (kind === 'news') news[id] = parseNews(raw[path]); else shows[id] = JSON.parse(raw[path]);
    }
  }
  return { data, news, shows, images: await listImageFiles(), revisions: Object.fromEntries(Object.entries(raw).map(([path, value]) => [path, hash(value)])) };
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('La solicitud no contiene contenido válido.');
  const { data, news, shows, revisions } = payload;
  if (!data || !news || !shows || !revisions) throw new Error('Faltan módulos o revisiones de la copia de trabajo. Recarga antes de guardar.');
  for (const [key, schema] of Object.entries(DATA_SCHEMAS)) { const result = schema.safeParse(data[key]); if (!result.success) throw new Error(`${key}:\n${validationError(result.error)}`); }
  if (data.band.members.map((member) => member.id).sort().join(',') !== 'alex,pato,victor') throw new Error('La banda debe conservar exactamente a Víctor, Alex y Pato.');
  for (const [slug, article] of Object.entries(news)) {
    if (!identifierSchema.safeParse(slug).success) throw new Error(`Slug de noticia no válido: ${slug}`);
    if (!article || typeof article !== 'object' || typeof article.body !== 'string') throw new Error(`Noticia inválida: ${slug}`);
    const result = newsSchema.safeParse(article.frontmatter); if (!result.success) throw new Error(`Noticia ${slug}:\n${validationError(result.error)}`);
  }
  for (const [filename, show] of Object.entries(shows)) {
    if (!identifierSchema.safeParse(filename).success) throw new Error(`ID de tocata no válido: ${filename}`);
    const result = showSchema.safeParse(show); if (!result.success) throw new Error(`Tocata ${filename}:\n${validationError(result.error)}`);
    if (show.id !== filename) throw new Error(`La tocata ${filename} debe conservar el mismo ID dentro del archivo.`);
  }
}

function targetFiles(payload) {
  const files = new Map();
  for (const [key, path] of Object.entries(DATA_FILES)) files.set(path, toJson(payload.data[key]));
  for (const [slug, article] of Object.entries(payload.news)) files.set(`src/content/news/${slug}.md`, serializeNews(article));
  for (const [id, show] of Object.entries(payload.shows)) files.set(`src/content/shows/${id}.json`, toJson(show));
  return files;
}

export async function saveSnapshot(payload) {
  validatePayload(payload);
  const actual = (await loadSnapshot()).revisions;
  if (JSON.stringify(actual) !== JSON.stringify(payload.revisions)) throw new Error('Se detectaron cambios externos. Recarga el editor antes de guardar para evitar sobrescrituras.');
  const files = targetFiles(payload); const expected = new Set(Object.keys(payload.revisions)); const allPaths = new Set([...expected, ...files.keys()]);
  for (const path of allPaths) if (!path.startsWith('src/data/') && !path.startsWith('src/content/news/') && !path.startsWith('src/content/shows/')) throw new Error('Ruta de escritura no autorizada.');
  const transaction = resolve(TRANSACTIONS, randomUUID()); const backup = resolve(transaction, 'backup'); const staged = resolve(transaction, 'staged'); const moved = [];
  try {
    await mkdir(backup, { recursive: true }); await mkdir(staged, { recursive: true });
    for (const [path, content] of files) { const temporary = resolve(staged, path); await mkdir(resolve(temporary, '..'), { recursive: true }); await writeFile(temporary, content, 'utf8'); }
    for (const path of allPaths) { const target = resolve(ROOT, path); if (!isInside(ROOT, target)) throw new Error('Ruta fuera del repositorio rechazada.'); if (existsSync(target)) { const saved = resolve(backup, path); await mkdir(resolve(saved, '..'), { recursive: true }); await rename(target, saved); moved.push(path); } }
    for (const [path] of files) { const target = resolve(ROOT, path); await mkdir(resolve(target, '..'), { recursive: true }); await rename(resolve(staged, path), target); }
  } catch (error) {
    for (const path of files.keys()) await rm(resolve(ROOT, path), { force: true }).catch(() => {});
    for (const path of moved) { const original = resolve(ROOT, path); const saved = resolve(backup, path); if (existsSync(saved)) { await mkdir(resolve(original, '..'), { recursive: true }); await rename(saved, original).catch(() => {}); } }
    throw error;
  } finally { await rm(transaction, { recursive: true, force: true }).catch(() => {}); }
  return loadSnapshot();
}

function send(response, status, body, type = 'application/json; charset=utf-8') { response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); response.end(typeof body === 'string' ? body : JSON.stringify(body)); }
async function readRequest(request) { let body = ''; for await (const chunk of request) { body += chunk; if (body.length > 5_000_000) throw new Error('La solicitud excede el tamaño permitido.'); } return JSON.parse(body || '{}'); }
async function sendFile(response, file, type) { response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }); createReadStream(file).pipe(response); }
export function createEditorServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      if (request.method === 'GET' && url.pathname === '/api/snapshot') return send(response, 200, await loadSnapshot());
      if (request.method === 'POST' && url.pathname === '/api/save') return send(response, 200, await saveSnapshot(await readRequest(request)));
      if (request.method === 'GET' && url.pathname.startsWith('/images/')) {
        const imagePath = resolve(PUBLIC_IMAGES, decodeURIComponent(url.pathname.slice('/images/'.length)));
        const extension = extname(imagePath).toLowerCase();
        if (!isInside(PUBLIC_IMAGES, imagePath) || !IMAGE_EXTENSIONS.has(extension) || !existsSync(imagePath) || !(await stat(imagePath)).isFile()) return send(response, 404, 'Imagen no encontrada.', 'text/plain; charset=utf-8');
        return sendFile(response, imagePath, MIME_TYPES[extension]);
      }
      const file = resolve(EDITOR_PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
      if (!isInside(EDITOR_PUBLIC, file) || !existsSync(file) || !(await stat(file)).isFile()) return send(response, 404, 'No encontrado.', 'text/plain; charset=utf-8');
      const type = extname(file) === '.css' ? 'text/css; charset=utf-8' : extname(file) === '.js' ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8';
      return sendFile(response, file, type);
    } catch (error) { send(response, 400, { error: error instanceof Error ? error.message : 'Error inesperado.' }); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) { const port = Number(process.env.EDITOR_PORT || 4388); createEditorServer().listen(port, '127.0.0.1', () => console.log(`Editor local: http://127.0.0.1:${port}`)); }
