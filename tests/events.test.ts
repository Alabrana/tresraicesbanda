import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatCivilDate,
  getCivilDateInTimeZone,
} from '../src/lib/civil-date.ts';
import {
  classifyShows,
  getHomePastShows,
  type ClassifiableShow,
  watchShowClassification,
} from '../src/lib/events.ts';

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

test('el resumen del Inicio muestra entre cero y tres pasadas y enlaza solo cuando hay más', () => {
  for (const count of [0, 1, 2, 3, 4]) {
    const shows: ClassifiableShow[] = Array.from({ length: count }, (_, index) => ({
      id: `pasada-${index + 1}`,
      date: `2026-11-${String(index + 1).padStart(2, '0')}`,
      time: '21:00',
      status: 'scheduled',
      visible: true,
    }));
    const preview = getHomePastShows(classifyShows(shows, '2026-11-15'));

    assert.equal(preview.items.length, Math.min(count, 3), `cantidad: ${count}`);
    assert.equal(preview.hasMore, count > 3, `cantidad: ${count}`);
  }
});

test('el resumen del Inicio conserva orden descendente y excluye ocultas y estados especiales', () => {
  const shows: ClassifiableShow[] = [
    { id: 'antigua', date: '2026-11-01', time: '22:00', status: 'scheduled', visible: true },
    { id: 'reciente', date: '2026-11-14', time: '20:00', status: 'scheduled', visible: true },
    { id: 'intermedia', date: '2026-11-10', time: '21:00', status: 'scheduled', visible: true },
    { id: 'hoy', date: '2026-11-15', time: '00:01', status: 'scheduled', visible: true },
    { id: 'oculta', date: '2026-11-13', time: '21:00', status: 'scheduled', visible: false },
    { id: 'cancelada', date: '2026-11-12', time: '21:00', status: 'cancelled', visible: true },
    { id: 'reprogramada', date: '2026-11-11', time: '21:00', status: 'rescheduled', visible: true },
  ];

  const preview = getHomePastShows(classifyShows(shows, '2026-11-15'));

  assert.deepEqual(preview.items.map(({ id }) => id), ['reciente', 'intermedia', 'antigua']);
  assert.equal(preview.hasMore, false);
});

test('el reloj ligero reclasifica cuando cambia el día chileno', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  let intervalCallback = () => {};
  let visibilityCallback = () => {};
  let instant = new Date('2026-11-16T02:30:00.000Z');
  const observedDates: string[] = [];

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      clearInterval: () => {},
      setInterval: (callback: () => void) => {
        intervalCallback = callback;
        return 1;
      },
    },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      addEventListener: (_event: string, callback: () => void) => {
        visibilityCallback = callback;
      },
      removeEventListener: () => {},
      visibilityState: 'visible',
    },
  });

  try {
    const stop = watchShowClassification(
      [{ id: 'tocata', date: '2026-11-15', time: '23:59', status: 'scheduled', visible: true }],
      ({ today }) => observedDates.push(today),
      { now: () => instant },
    );

    assert.deepEqual(observedDates, ['2026-11-15']);
    intervalCallback();
    assert.deepEqual(observedDates, ['2026-11-15']);

    instant = new Date('2026-11-16T03:01:00.000Z');
    visibilityCallback();
    assert.deepEqual(observedDates, ['2026-11-15', '2026-11-16']);
    stop();
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});
