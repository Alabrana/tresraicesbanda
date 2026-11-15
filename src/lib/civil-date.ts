export const CHILE_TIME_ZONE = 'America/Santiago';

export interface CivilDateParts {
  year: number;
  month: number;
  day: number;
}

export function parseCivilDate(value: string): CivilDateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function isCivilDate(value: string): boolean {
  return parseCivilDate(value) !== null;
}

export function formatCivilDate(value: string, locale = 'es-CL'): string {
  const parts = parseCivilDate(value);
  if (!parts) throw new RangeError(`Fecha civil inválida: ${value}`);

  const dateAtUtcNoon = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dateAtUtcNoon);
}

export function getCivilDateInTimeZone(
  instant = new Date(),
  timeZone = CHILE_TIME_ZONE,
): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    calendar: 'gregory',
    day: '2-digit',
    month: '2-digit',
    numberingSystem: 'latn',
    timeZone,
    year: 'numeric',
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(instant)
      .filter(({ type }) => type === 'year' || type === 'month' || type === 'day')
      .map(({ type, value }) => [type, value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function compareCivilDates(left: string, right: string): number {
  if (!isCivilDate(left) || !isCivilDate(right)) {
    throw new RangeError(`No se pueden comparar fechas civiles inválidas: ${left}, ${right}`);
  }

  return left.localeCompare(right);
}
