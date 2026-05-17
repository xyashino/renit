import dayjs from 'dayjs';
import { parseDate } from './dates';

/** Maps UI start date + duration to API period (exclusive `dateTo`). */
export function rentalPeriodFromDuration(
  dateFromYmd: string,
  durationDays: number
): { dateFromIso: string; dateToIso: string; lastInclusiveYmd: string } | null {
  const from = parseDate(dateFromYmd);
  if (!from || durationDays < 1) return null;

  const fromDay = dayjs.utc(from);
  const exclusiveEnd = fromDay.add(durationDays, 'day');
  const lastInclusive = exclusiveEnd.subtract(1, 'day');

  return {
    dateFromIso: fromDay.toISOString(),
    dateToIso: exclusiveEnd.toISOString(),
    lastInclusiveYmd: lastInclusive.format('YYYY-MM-DD'),
  };
}
