import assert from 'node:assert/strict';
import test from 'node:test';
import { parseNews, serializeNews } from '../editor/server.mjs';
import { showsArrayToMap, showsMapToArray } from '../editor/public/show-collection.js';

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

test('el editor presenta las tocatas como arreglo y recupera el mapa por ID al guardar', () => {
  const showsById = {
    'primera-fecha': { id: 'primera-fecha', title: 'Primera fecha' },
    'segunda-fecha': { id: 'segunda-fecha', title: 'Segunda fecha' },
  };

  const editableShows = showsMapToArray(showsById);

  assert.equal(Array.isArray(editableShows), true);
  assert.deepEqual(editableShows.map(({ id }) => id), ['primera-fecha', 'segunda-fecha']);
  assert.deepEqual(showsArrayToMap(editableShows), showsById);
});

test('el editor rechaza IDs de tocata ausentes o duplicados al convertir el arreglo', () => {
  assert.throws(
    () => showsArrayToMap([{ id: 'fecha-repetida' }, { id: 'fecha-repetida' }]),
    /id único/,
  );
  assert.throws(() => showsArrayToMap([{ title: 'Sin ID' }]), /necesita un id/);
});
