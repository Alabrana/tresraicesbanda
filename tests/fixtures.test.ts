import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { newsSchema, showSchema, slugSchema } from '../src/lib/contracts.ts';

function parseTechnicalMarkdownFixture(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(source);
  assert.ok(match, 'La fixture Markdown debe incluir frontmatter y cuerpo.');

  const frontmatter = Object.fromEntries(
    match[1].split(/\r?\n/).map((line) => {
      const separator = line.indexOf(':');
      assert.notEqual(separator, -1, `Línea de frontmatter inválida: ${line}`);
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
  );

  return { frontmatter, body: match[2].trim() };
}

test('valida una noticia Markdown técnica fuera del contenido publicable', async () => {
  const fixturePath = resolve(process.cwd(), 'tests/fixtures/news/noticia-tecnica.md');
  const source = await readFile(fixturePath, 'utf8');
  const { frontmatter, body } = parseTechnicalMarkdownFixture(source);

  assert.doesNotThrow(() => slugSchema.parse('noticia-tecnica'));
  assert.doesNotThrow(() => newsSchema.parse(frontmatter));
  assert.ok(body.length > 0);
  assert.equal(fixturePath.includes('/src/content/'), false);
});

test('valida una tocata JSON técnica fuera del contenido publicable', async () => {
  const fixturePath = resolve(process.cwd(), 'tests/fixtures/shows/tocata-tecnica.json');
  const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));

  assert.doesNotThrow(() => showSchema.parse(fixture));
  assert.equal(fixturePath.includes('/src/content/'), false);
});
