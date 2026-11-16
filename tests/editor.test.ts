import assert from 'node:assert/strict';
import test from 'node:test';
import { parseNews, serializeNews } from '../editor/server.mjs';

test('el editor conserva el frontmatter y cuerpo de una noticia al serializar', () => {
  const article = {
    frontmatter: {
      title: 'Noticia de prueba',
      date: '2026-11-16',
      summary: 'Resumen de prueba.',
      cover: '/images/news/prueba.webp',
      images: ['/images/news/prueba.webp'],
    },
    body: 'Contenido de prueba.\n',
  };

  assert.deepEqual(parseNews(serializeNews(article)), article);
});

test('el editor rechaza una noticia sin frontmatter delimitado', () => {
  assert.throws(() => parseNews('Sin frontmatter'));
});
