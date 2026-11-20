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

export interface HomePastShows<T extends ClassifiableShow> {
  items: T[];
  hasMore: boolean;
}

export interface HomeShowSelection<T extends ClassifiableShow> {
  featured: T | null;
  upcoming: T[];
  past: T[];
  hasMorePast: boolean;
}

export const HOME_UPCOMING_SHOW_LIMIT = 3;
export const HOME_PAST_SHOW_LIMIT = 3;

function compareDateAndTime<T extends ClassifiableShow>(left: T, right: T): number {
  return compareCivilDates(left.date, right.date)
    || left.time.localeCompare(right.time)
    || left.id.localeCompare(right.id);
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
  const cancelled = visible.filter((show) => show.status === 'cancelled').sort(compareDateAndTime);
  const rescheduled = visible.filter((show) => show.status === 'rescheduled').sort(compareDateAndTime);

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

export function getHomeShowSelection<T extends ClassifiableShow>(
  classification: Pick<ShowClassification<T>, 'upcoming' | 'past'>,
): HomeShowSelection<T> {
  return {
    featured: classification.upcoming[0] ?? null,
    upcoming: classification.upcoming.slice(1, HOME_UPCOMING_SHOW_LIMIT + 1),
    past: classification.past.slice(0, HOME_PAST_SHOW_LIMIT),
    hasMorePast: classification.past.length > HOME_PAST_SHOW_LIMIT,
  };
}

export function getHomePastShows<T extends ClassifiableShow>(
  classification: Pick<ShowClassification<T>, 'past'>,
): HomePastShows<T> {
  return {
    items: classification.past.slice(0, HOME_PAST_SHOW_LIMIT),
    hasMore: classification.past.length > HOME_PAST_SHOW_LIMIT,
  };
}

interface WatchOptions {
  now?: () => Date;
}

const TRANSITION_SEARCH_WINDOW_MS = 30 * 60 * 60 * 1000;

export function getNextCivilDateTransition(
  instant = new Date(),
  timeZone = CHILE_TIME_ZONE,
): Date {
  const currentDate = getCivilDateInTimeZone(instant, timeZone);
  let lower = instant.getTime();
  let upper = lower + TRANSITION_SEARCH_WINDOW_MS;

  while (getCivilDateInTimeZone(new Date(upper), timeZone) === currentDate) {
    upper += TRANSITION_SEARCH_WINDOW_MS;
  }

  while (upper - lower > 1) {
    const middle = Math.floor((lower + upper) / 2);
    if (getCivilDateInTimeZone(new Date(middle), timeZone) === currentDate) lower = middle;
    else upper = middle;
  }

  return new Date(upper);
}

export function getShowDetailUrl(show: { status: ShowStatus; ticketUrl?: unknown }): string | null {
  if (show.status !== 'scheduled') return null;

  const value = show.ticketUrl;
  if (typeof value !== 'string' || value.trim() === '') return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

export function watchShowClassification<T extends ClassifiableShow>(
  shows: readonly T[],
  onChange: (classification: ShowClassification<T>) => void,
  { now = () => new Date() }: WatchOptions = {},
): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  let lastCivilDate = '';
  let transitionTimer: number | undefined;

  const scheduleNextTransition = (instant: Date) => {
    if (transitionTimer !== undefined) window.clearTimeout(transitionTimer);
    const transition = getNextCivilDateTransition(instant, CHILE_TIME_ZONE);
    const delay = Math.max(0, transition.getTime() - instant.getTime() + 50);
    transitionTimer = window.setTimeout(() => refresh(), delay);
  };
  const refresh = () => {
    const instant = now();
    const currentCivilDate = getCivilDateInTimeZone(instant, CHILE_TIME_ZONE);
    scheduleNextTransition(instant);
    if (currentCivilDate === lastCivilDate) return;

    lastCivilDate = currentCivilDate;
    onChange(classifyShows(shows, currentCivilDate));
  };
  const refreshWhenVisible = () => {
    if (document.visibilityState === 'visible') refresh();
  };

  refresh();
  document.addEventListener('visibilitychange', refreshWhenVisible);
  window.addEventListener('focus', refresh);

  return () => {
    if (transitionTimer !== undefined) window.clearTimeout(transitionTimer);
    document.removeEventListener('visibilitychange', refreshWhenVisible);
    window.removeEventListener('focus', refresh);
  };
}
