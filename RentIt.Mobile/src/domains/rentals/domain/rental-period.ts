import { parseDate } from './duration';

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toUtcYmd(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/** Maps UI start date + duration to API period (exclusive `dateTo`). */
export function rentalPeriodFromDuration(
  dateFromYmd: string,
  durationDays: number
): { dateFromIso: string; dateToIso: string; lastInclusiveYmd: string } | null {
  const from = parseDate(dateFromYmd);
  if (!from || durationDays < 1) return null;

  const exclusiveEnd = addUtcDays(from, durationDays);
  const lastInclusive = addUtcDays(exclusiveEnd, -1);

  return {
    dateFromIso: from.toISOString(),
    dateToIso: exclusiveEnd.toISOString(),
    lastInclusiveYmd: toUtcYmd(lastInclusive),
  };
}
