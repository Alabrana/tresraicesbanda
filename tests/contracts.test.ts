import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  civilDateSchema,
  createImagePathSchema,
  httpUrlSchema,
  identifierSchema,
  imagePathSchema,
  localTimeSchema,
  mediaSchema,
  showSchema,
  slugSchema,
  youtubeVideoUrlSchema,
} from '../src/lib/contracts.ts';

test('valida fechas civiles reales y rechaza fechas imposibles', () => {
  for (const value of ['2024-02-29', '2026-11-15', '2000-01-01']) {
    assert.equal(civilDateSchema.safeParse(value).success, true, value);
  }

  for (const value of ['2026-02-29', '2026-02-30', '2026-99-99', '15-11-2026']) {
    assert.equal(civilDateSchema.safeParse(value).success, false, value);
  }
});

test('valida horas reales en formato HH:mm', () => {
  for (const value of ['00:00', '09:05', '23:59']) {
    assert.equal(localTimeSchema.safeParse(value).success, true, value);
  }

  for (const value of ['24:00', '23:60', '99:99', '9:05']) {
    assert.equal(localTimeSchema.safeParse(value).success, false, value);
  }
});

test('restringe identificadores y slugs a un formato estable', () => {
  for (const value of ['victor', 'show-2026', 'noticia-tecnica']) {
    assert.equal(identifierSchema.safeParse(value).success, true, value);
    assert.equal(slugSchema.safeParse(value).success, true, value);
  }

  for (const value of ['Víctor', 'Show_2026', '../escape', 'doble--guion', 'con espacio']) {
    assert.equal(identifierSchema.safeParse(value).success, false, value);
    assert.equal(slugSchema.safeParse(value).success, false, value);
  }
});

test('acepta solamente URLs HTTP/HTTPS', () => {
  assert.equal(httpUrlSchema.safeParse('https://example.com/recurso').success, true);
  assert.equal(httpUrlSchema.safeParse('http://example.com/recurso').success, true);
  assert.equal(httpUrlSchema.safeParse('ftp://example.com/recurso').success, false);
  assert.equal(httpUrlSchema.safeParse('javascript:alert(1)').success, false);
  assert.equal(httpUrlSchema.safeParse('sin-protocolo.example').success, false);
});

test('ticketUrl es opcional en tocatas y, cuando existe, exige HTTP/HTTPS', () => {
  const show = {
    id: 'tocata-confirmada',
    title: 'Tocata confirmada',
    date: '2026-11-28',
    time: '21:00',
    venue: 'Lugar confirmado',
    city: 'Talcahuano',
    poster: '/images/shows/tresRaicesZalsipuedes.webp',
    status: 'scheduled',
    visible: true,
  };

  assert.equal(showSchema.safeParse(show).success, true);
  assert.equal(showSchema.safeParse({ ...show, ticketUrl: 'https://example.com/entradas' }).success, true);
  assert.equal(showSchema.safeParse({ ...show, ticketUrl: 'ftp://example.com/entradas' }).success, false);
});

test('valida URLs de videos YouTube y rechaza otros hosts o recursos', () => {
  for (const value of [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://youtube.com/shorts/dQw4w9WgXcQ',
  ]) {
    assert.equal(youtubeVideoUrlSchema.safeParse(value).success, true, value);
  }

  for (const value of [
    'https://example.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/',
    'https://youtube.com/watch?v=corto',
    'javascript:https://youtube.com/watch?v=dQw4w9WgXcQ',
  ]) {
    assert.equal(youtubeVideoUrlSchema.safeParse(value).success, false, value);
  }
});

test('rechaza IDs duplicados en colecciones JSON', () => {
  const result = mediaSchema.safeParse({
    platforms: [
      { id: 'plataforma', name: 'Uno', url: 'https://example.com/uno', visible: true },
      { id: 'plataforma', name: 'Dos', url: 'https://example.com/dos', visible: true },
    ],
    videos: [],
  });

  assert.equal(result.success, false);
});

test('permite videos sin fecha y valida la fecha cuando se proporciona', () => {
  const baseVideo = {
    id: 'video-confirmado',
    title: 'Video confirmado',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    visible: true,
  };

  assert.equal(mediaSchema.safeParse({ platforms: [], videos: [baseVideo] }).success, true);
  assert.equal(
    mediaSchema.safeParse({ platforms: [], videos: [{ ...baseVideo, date: '2026-02-30' }] }).success,
    false,
  );
});

test('acepta imágenes web reales dentro de public/images', () => {
  assert.equal(
    imagePathSchema.safeParse('/images/logos/logoprincipalHorizontal.webp').success,
    true,
  );
});

test('rechaza traversal, directorios, extensiones no permitidas y archivos inexistentes', () => {
  const fixtureImagesRoot = resolve(process.cwd(), 'tests/fixtures/public/images');
  const fixtureImageSchema = createImagePathSchema(fixtureImagesRoot);

  assert.equal(imagePathSchema.safeParse('/images/../../package.json').success, false);
  assert.equal(imagePathSchema.safeParse('/images/logos').success, false);
  assert.equal(imagePathSchema.safeParse('/images/logos/no-existe.png').success, false);
  assert.equal(fixtureImageSchema.safeParse('/images/not-image.txt').success, false);
  assert.equal(imagePathSchema.safeParse('/images/%2e%2e/package.json').success, false);
});
