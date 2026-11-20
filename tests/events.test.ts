import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatCivilDate,
  getCivilDateInTimeZone,
} from '../src/lib/civil-date.ts';
import {
  classifyShows,
  getHomeShowSelection,
  getHomePastShows,
  getNextCivilDateTransition,
  getShowDetailUrl,
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

test('ordena por fecha, hora e ID estable sin depender del orden del JSON', () => {
  const shows: ClassifiableShow[] = [
    { id: 'misma-hora-b', date: '2026-11-20', time: '21:00', status: 'scheduled', visible: true },
    { id: 'fecha-posterior', date: '2026-11-21', time: '18:00', status: 'scheduled', visible: true },
    { id: 'hora-temprana', date: '2026-11-20', time: '19:00', status: 'scheduled', visible: true },
    { id: 'misma-hora-a', date: '2026-11-20', time: '21:00', status: 'scheduled', visible: true },
  ];

  const result = classifyShows(shows, '2026-11-15');

  assert.deepEqual(
    result.upcoming.map(({ id }) => id),
    ['hora-temprana', 'misma-hora-a', 'misma-hora-b', 'fecha-posterior'],
  );
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

test('una presentación sigue vigente durante todo su día y termina a medianoche en Chile', () => {
  const shows: ClassifiableShow[] = [
    { id: 'tocata', date: '2026-11-15', time: '21:30', status: 'scheduled', visible: true },
  ];
  const beforeStart = new Date('2026-11-15T23:00:00.000Z');
  const duringShow = new Date('2026-11-16T00:31:00.000Z');
  const afterCivilDay = new Date('2026-11-16T03:01:00.000Z');

  assert.equal(classifyShows(shows, getCivilDateInTimeZone(beforeStart)).upcoming.length, 1);
  assert.equal(classifyShows(shows, getCivilDateInTimeZone(duringShow)).upcoming.length, 1);
  assert.equal(classifyShows(shows, getCivilDateInTimeZone(afterCivilDay)).past.length, 1);
});

test('selecciona destacado, tres próximas adicionales y tres pasadas sin duplicar', () => {
  const shows: ClassifiableShow[] = [
    ...Array.from({ length: 5 }, (_, index) => ({
      id: `futura-${index + 1}`,
      date: `2026-11-${String(index + 16).padStart(2, '0')}`,
      time: '21:00',
      status: 'scheduled' as const,
      visible: true,
    })),
    ...Array.from({ length: 4 }, (_, index) => ({
      id: `pasada-${index + 1}`,
      date: `2026-11-${String(index + 1).padStart(2, '0')}`,
      time: '21:00',
      status: 'scheduled' as const,
      visible: true,
    })),
  ];

  const selection = getHomeShowSelection(classifyShows(shows, '2026-11-15'));

  assert.equal(selection.featured?.id, 'futura-1');
  assert.deepEqual(selection.upcoming.map(({ id }) => id), ['futura-2', 'futura-3', 'futura-4']);
  assert.deepEqual(selection.past.map(({ id }) => id), ['pasada-4', 'pasada-3', 'pasada-2']);
  assert.equal(selection.hasMorePast, true);
  assert.equal(selection.upcoming.some(({ id }) => id === selection.featured?.id), false);
});

test('el Inicio aplica los estados vacíos y límites para cero a cinco futuras', () => {
  for (let count = 0; count <= 5; count += 1) {
    const shows: ClassifiableShow[] = Array.from({ length: count }, (_, index) => ({
      id: `futura-${index + 1}`,
      date: `2026-12-${String(index + 1).padStart(2, '0')}`,
      time: '21:00',
      status: 'scheduled',
      visible: true,
    }));
    const selection = getHomeShowSelection(classifyShows(shows, '2026-11-15'));

    assert.equal(selection.featured?.id ?? null, count === 0 ? null : 'futura-1', `cantidad: ${count}`);
    assert.equal(selection.upcoming.length, Math.min(Math.max(count - 1, 0), 3), `cantidad: ${count}`);
  }
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

test('calcula la próxima medianoche chilena sin depender de la zona del visitante', () => {
  assert.equal(
    getNextCivilDateTransition(new Date('2026-11-16T02:30:00.000Z')).toISOString(),
    '2026-11-16T03:00:00.000Z',
  );
  assert.equal(
    getNextCivilDateTransition(new Date('2026-07-01T03:30:00.000Z')).toISOString(),
    '2026-07-01T04:00:00.000Z',
  );
});

test('acepta solo URLs HTTP/HTTPS no vacías para Ver detalle', () => {
  assert.equal(
    getShowDetailUrl({ status: 'scheduled', ticketUrl: ' https://example.com/evento ' }),
    'https://example.com/evento',
  );
  assert.equal(
    getShowDetailUrl({ status: 'scheduled', ticketUrl: 'http://example.com/gratis' }),
    'http://example.com/gratis',
  );
  assert.equal(getShowDetailUrl({ status: 'scheduled', ticketUrl: '' }), null);
  assert.equal(getShowDetailUrl({ status: 'scheduled', ticketUrl: '   ' }), null);
  assert.equal(getShowDetailUrl({ status: 'scheduled' }), null);
  assert.equal(getShowDetailUrl({ status: 'scheduled', ticketUrl: 'ftp://example.com/evento' }), null);
  assert.equal(getShowDetailUrl({ status: 'scheduled', ticketUrl: 'sin-protocolo.example' }), null);
  assert.equal(
    getShowDetailUrl({ status: 'cancelled', ticketUrl: 'https://example.com/evento' }),
    null,
  );
  assert.equal(
    getShowDetailUrl({ status: 'rescheduled', ticketUrl: 'https://example.com/evento' }),
    null,
  );
});

test('el reloj ligero se programa una vez y reclasifica por transición, visibilidad y foco', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  let timeoutCallback = () => {};
  let visibilityCallback = () => {};
  let focusCallback = () => {};
  let instant = new Date('2026-11-16T02:30:00.000Z');
  const observedDates: string[] = [];
  const observedDelays: number[] = [];

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      addEventListener: (_event: string, callback: () => void) => {
        focusCallback = callback;
      },
      clearTimeout: () => {},
      removeEventListener: () => {},
      setTimeout: (callback: () => void, delay: number) => {
        timeoutCallback = callback;
        observedDelays.push(delay);
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
    assert.equal(observedDelays.length, 1);
    assert.ok(observedDelays[0] >= 30 * 60 * 1000);

    focusCallback();
    assert.deepEqual(observedDates, ['2026-11-15']);

    instant = new Date('2026-11-16T03:01:00.000Z');
    timeoutCallback();
    assert.deepEqual(observedDates, ['2026-11-15', '2026-11-16']);

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
