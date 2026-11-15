import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatCivilDate,
  getCivilDateInTimeZone,
} from '../src/lib/civil-date.ts';
import { classifyShows, type ClassifiableShow } from '../src/lib/events.ts';

test('formatea una fecha editorial en es-CL sin cambiar el día', () => {
  assert.equal(formatCivilDate('2026-11-15'), '15-11-2026');
  assert.equal(formatCivilDate('2024-02-29'), '29-02-2024');
});

test('calcula el día chileno correctamente en verano e invierno', () => {
  assert.equal(
    getCivilDateInTimeZone(new Date('2026-01-01T02:30:00.000Z')),
    '2025-12-31',
  );
  assert.equal(
    getCivilDateInTimeZone(new Date('2026-07-01T03:30:00.000Z')),
    '2026-06-30',
  );
  assert.equal(
    getCivilDateInTimeZone(new Date('2026-07-01T04:30:00.000Z')),
    '2026-07-01',
  );
});

test('clasifica próximas y pasadas con el día actual vigente completo', () => {
  const shows: ClassifiableShow[] = [
    { id: 'futuro-dos', date: '2026-11-20', time: '20:00', status: 'scheduled', visible: true },
    { id: 'pasado-antiguo', date: '2026-10-01', time: '22:00', status: 'scheduled', visible: true },
    { id: 'hoy', date: '2026-11-15', time: '00:01', status: 'scheduled', visible: true },
    { id: 'futuro-uno', date: '2026-11-18', time: '21:00', status: 'scheduled', visible: true },
    { id: 'pasado-reciente', date: '2026-11-14', time: '23:59', status: 'scheduled', visible: true },
  ];

  const result = classifyShows(shows, '2026-11-15');

  assert.deepEqual(result.upcoming.map(({ id }) => id), ['hoy', 'futuro-uno', 'futuro-dos']);
  assert.deepEqual(result.past.map(({ id }) => id), ['pasado-reciente', 'pasado-antiguo']);
  assert.equal(result.nextShow?.id, 'hoy');
});

test('separa canceladas y reprogramadas y nunca las destaca como próximas', () => {
  const shows: ClassifiableShow[] = [
    { id: 'cancelada', date: '2026-11-16', time: '20:00', status: 'cancelled', visible: true },
    { id: 'reprogramada', date: '2026-11-17', time: '20:00', status: 'rescheduled', visible: true },
    { id: 'confirmada', date: '2026-11-18', time: '20:00', status: 'scheduled', visible: true },
    { id: 'oculta', date: '2026-11-15', time: '20:00', status: 'scheduled', visible: false },
  ];

  const result = classifyShows(shows, '2026-11-15');

  assert.deepEqual(result.cancelled.map(({ id }) => id), ['cancelada']);
  assert.deepEqual(result.rescheduled.map(({ id }) => id), ['reprogramada']);
  assert.deepEqual(result.upcoming.map(({ id }) => id), ['confirmada']);
  assert.equal(result.nextShow?.id, 'confirmada');
  assert.equal(result.visible.some(({ id }) => id === 'oculta'), false);
});

test('una scheduled pasa al historial al cambiar el día civil chileno', () => {
  const shows: ClassifiableShow[] = [
    { id: 'tocata', date: '2026-11-15', time: '23:59', status: 'scheduled', visible: true },
  ];

  assert.equal(classifyShows(shows, '2026-11-15').upcoming.length, 1);
  assert.equal(classifyShows(shows, '2026-11-16').past.length, 1);
});
