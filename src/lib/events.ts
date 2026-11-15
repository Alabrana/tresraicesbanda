import {
  CHILE_TIME_ZONE,
  compareCivilDates,
  getCivilDateInTimeZone,
  isCivilDate,
} from './civil-date.ts';

export type ShowStatus = 'scheduled' | 'cancelled' | 'rescheduled';

export interface ClassifiableShow {
  id: string;
  date: string;
  time: string;
  status: ShowStatus;
  visible: boolean;
}

export interface ShowClassification<T extends ClassifiableShow> {
  today: string;
  visible: T[];
  upcoming: T[];
  past: T[];
  cancelled: T[];
  rescheduled: T[];
  nextShow: T | null;
}

function compareDateAndTime<T extends ClassifiableShow>(left: T, right: T): number {
  return compareCivilDates(left.date, right.date) || left.time.localeCompare(right.time);
}

export function classifyShows<T extends ClassifiableShow>(
  shows: readonly T[],
  today = getCivilDateInTimeZone(new Date(), CHILE_TIME_ZONE),
): ShowClassification<T> {
  if (!isCivilDate(today)) throw new RangeError(`Fecha de clasificación inválida: ${today}`);

  const visible = shows.filter((show) => show.visible);
  visible.forEach((show) => {
    if (!isCivilDate(show.date)) throw new RangeError(`Fecha inválida en la tocata ${show.id}.`);
  });

  const upcoming = visible
    .filter((show) => show.status === 'scheduled' && compareCivilDates(show.date, today) >= 0)
    .sort(compareDateAndTime);
  const past = visible
    .filter((show) => show.status === 'scheduled' && compareCivilDates(show.date, today) < 0)
    .sort((left, right) => compareDateAndTime(right, left));
  const cancelled = visible.filter((show) => show.status === 'cancelled');
  const rescheduled = visible.filter((show) => show.status === 'rescheduled');

  return {
    today,
    visible,
    upcoming,
    past,
    cancelled,
    rescheduled,
    nextShow: upcoming[0] ?? null,
  };
}

interface WatchOptions {
  intervalMs?: number;
  now?: () => Date;
}

export function watchShowClassification<T extends ClassifiableShow>(
  shows: readonly T[],
  onChange: (classification: ShowClassification<T>) => void,
  { intervalMs = 60_000, now = () => new Date() }: WatchOptions = {},
): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  let lastCivilDate = '';
  const refresh = () => {
    const currentCivilDate = getCivilDateInTimeZone(now(), CHILE_TIME_ZONE);
    if (currentCivilDate === lastCivilDate) return;

    lastCivilDate = currentCivilDate;
    onChange(classifyShows(shows, currentCivilDate));
  };
  const refreshWhenVisible = () => {
    if (document.visibilityState === 'visible') refresh();
  };

  refresh();
  const intervalId = window.setInterval(refresh, intervalMs);
  document.addEventListener('visibilitychange', refreshWhenVisible);

  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener('visibilitychange', refreshWhenVisible);
  };
}
