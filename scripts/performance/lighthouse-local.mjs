import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { gzipSync } from 'node:zlib';
import { AUDIT_ROUTES, CATEGORIES, DEFAULT_RUNS, DEFAULT_TIMEOUT_MS, STRATEGIES } from './config.mjs';
import {
  aggregateLabs,
  extractLabResult,
  extractOpportunities,
  extractResources,
  listOption,
  numberOption,
  parseArgs,
  prepareReportDirectory,
  representativeLhr,
  saveSummary,
  slugify,
} from './lib.mjs';

const MIME_TYPES = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8',
};
const COMPRESSIBLE = new Set(['.css', '.html', '.js', '.json', '.svg', '.xml']);

const options = parseArgs(process.argv.slice(2));
const routes = listOption(options.routes, AUDIT_ROUTES).map(normalizeRoute);
const strategies = listOption(options.strategies, STRATEGIES);
const runs = numberOption(options.runs, DEFAULT_RUNS);
const timeoutMs = numberOption(options.timeout, DEFAULT_TIMEOUT_MS);
const reportRoot = path.resolve(options.output ?? 'reports/performance');
const label = options.label ?? 'local';
const distDirectory = path.resolve(options.dist ?? 'dist');
const lighthouseCli = path.resolve('node_modules/lighthouse/cli/index.js');
const chromePath = options.chrome ?? process.env.CHROME_PATH ?? detectChrome();

if (!existsSync(path.join(distDirectory, 'index.html'))) throw new Error(`No existe un build estático en ${distDirectory}. Ejecuta pnpm run build.`);
if (!existsSync(lighthouseCli)) throw new Error('Lighthouse no está instalado. Ejecuta pnpm install.');
if (!chromePath) throw new Error('No se encontró Chrome/Chromium. Define CHROME_PATH o instala un navegador compatible.');
for (const strategy of strategies) {
  if (!STRATEGIES.includes(strategy)) throw new Error(`Estrategia no soportada: ${strategy}`);
}

const server = createStaticServer(distDirectory);
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const directory = options.resume
  ? path.resolve(options.resume)
  : await prepareReportDirectory(reportRoot, label, 'local');
await mkdir(path.join(directory, 'raw'), { recursive: true });
const measurements = [];
let lighthouseVersion = null;

try {
  for (const route of routes) {
    for (const strategy of strategies) {
      const lhrs = [];
      for (let run = 1; run <= runs; run += 1) {
        const url = new URL(route, baseUrl).href;
        const rawFile = path.join(directory, 'raw', `${slugify(route)}-${strategy}-run-${String(run).padStart(2, '0')}.json`);
        let lhr;
        if (existsSync(rawFile)) {
          lhr = JSON.parse(await readFile(rawFile, 'utf8'));
          process.stdout.write(`Reutilizando ${strategy} ${route} (${run}/${runs})\n`);
        } else {
          process.stdout.write(`Lighthouse ${strategy} ${route} (${run}/${runs})\n`);
          await runLighthouse({ url, strategy, rawFile, chromePath, timeoutMs });
          lhr = JSON.parse(await readFile(rawFile, 'utf8'));
        }
        if (lhr.runtimeError) throw new Error(`${route} ${strategy}: ${lhr.runtimeError.message}`);
        lighthouseVersion ??= lhr.lighthouseVersion ?? null;
        lhrs.push(lhr);
      }

      const lab = aggregateLabs(lhrs.map(extractLabResult));
      const representative = representativeLhr(lhrs, lab);
      measurements.push({
        url: route,
        strategy,
        successfulRuns: lhrs.length,
        lab,
        field: null,
        opportunities: extractOpportunities(representative),
        resources: extractResources(representative),
      });
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

const summary = {
  schemaVersion: 1,
  source: 'lighthouse-local',
  label,
  createdAt: new Date().toISOString(),
  environment: {
    kind: 'build estático local / Lighthouse CLI',
    baseUrl,
    routes,
    strategies,
    categories: CATEGORIES,
    lighthouseVersion,
    chromePath,
    runsPerRoute: runs,
  },
  measurements,
};

await saveSummary(directory, summary);
process.stdout.write(`Reporte guardado en ${directory}\n`);

function normalizeRoute(route) {
  const pathname = new URL(route, 'https://local.invalid').pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function detectChrome() {
  const candidates = process.platform === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium']
    : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  return candidates.find(existsSync) ?? null;
}

function runLighthouse({ url, strategy, rawFile, chromePath, timeoutMs }) {
  const args = [
    lighthouseCli,
    url,
    '--quiet',
    '--output=json',
    `--output-path=${rawFile}`,
    `--only-categories=${CATEGORIES.join(',')}`,
    `--chrome-path=${chromePath}`,
    '--chrome-flags=--headless=new --disable-gpu',
  ];
  if (strategy === 'desktop') args.push('--preset=desktop');

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Lighthouse excedió ${timeoutMs} ms para ${url} (${strategy}).`));
    }, timeoutMs);
    child.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once('exit', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`Lighthouse terminó con código ${code}: ${output.trim().slice(-2000)}`));
    });
  });
}

function createStaticServer(root) {
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const relative = path.normalize(pathname).replace(/^[/\\]+/, '');
      let file = path.resolve(root, relative);
      if (!file.startsWith(`${root}${path.sep}`) && file !== root) throw new Error('Ruta fuera de dist.');
      if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!existsSync(file) && !path.extname(file)) file = path.join(file, 'index.html');
      if (!existsSync(file) || !statSync(file).isFile()) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      const extension = path.extname(file).toLowerCase();
      const headers = {
        'content-type': MIME_TYPES[extension] ?? 'application/octet-stream',
        'cache-control': 'no-cache',
      };
      if (COMPRESSIBLE.has(extension) && request.headers['accept-encoding']?.includes('gzip')) {
        const body = gzipSync(await readFile(file));
        response.writeHead(200, { ...headers, 'content-encoding': 'gzip', 'content-length': body.length, vary: 'Accept-Encoding' });
        response.end(body);
        return;
      }
      response.writeHead(200, { ...headers, 'content-length': statSync(file).size });
      await pipeline(createReadStream(file), response);
    } catch (error) {
      if (response.headersSent) {
        response.destroy();
        return;
      }
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(error.message);
    }
  });
}
