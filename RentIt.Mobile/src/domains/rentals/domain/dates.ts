import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function parseDate(str: string): Date | null {
  const ymd = str.includes('T') ? str.split('T')[0]! : str;
  if (ymd.split('-').length !== 3) return null;
  const parsed = dayjs.utc(`${ymd}T00:00:00.000Z`);
  return parsed.isValid() ? parsed.toDate() : null;
}

export function daysBetween(from: Date | string, to: Date | string): number {
  const start = dayjs(from);
  const end = dayjs(to);
  if (!start.isValid() || !end.isValid()) return 1;
  return Math.max(1, Math.ceil(end.diff(start, 'day', true)));
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const parsed = dayjs(dateStr);
  if (!parsed.isValid()) return dateStr;
  return parsed.toDate().toLocaleDateString('pl-PL', options ?? { day: 'numeric', month: 'short' });
}

/** Etykieta zakresu terminu (np. „środa, 22 maja” lub „22–25 maja”). */
export function formatSlotLabel(dateFrom: string, dateToInclusive: string): string {
  if (dateFrom === dateToInclusive) {
    return formatDate(dateFrom, { weekday: 'long', day: 'numeric', month: 'long' });
  }

  const from = dayjs(dateFrom);
  const to = dayjs(dateToInclusive);
  if (!from.isValid() || !to.isValid()) {
    return `${formatDate(dateFrom)} – ${formatDate(dateToInclusive)}`;
  }

  if (from.year() === to.year() && from.month() === to.month()) {
    const month = from.toDate().toLocaleDateString('pl-PL', { month: 'long' });
    return `${from.date()}–${to.date()} ${month}`;
  }

  return `${formatDate(dateFrom)} – ${formatDate(dateToInclusive)}`;
}

export function slotInclusiveEndYmd(slot: { dateFrom: string; dateTo: string }): string {
  const exclusiveEnd = parseDate(slot.dateTo);
  if (!exclusiveEnd) return slot.dateTo;
  return toUtcYmd(addUtcDays(exclusiveEnd, -1));
}

export function toLocalYmd(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function startOfToday(): Date {
  return dayjs().startOf('day').toDate();
}

export function toUtcYmd(date: Date): string {
  return dayjs.utc(date).format('YYYY-MM-DD');
}

export function addUtcDays(date: Date, days: number): Date {
  return dayjs.utc(date).add(days, 'day').toDate();
}

export function startOfUtcCalendarDay(anchor: Date): Date {
  return dayjs
    .utc()
    .year(anchor.getUTCFullYear())
    .month(anchor.getUTCMonth())
    .date(anchor.getUTCDate())
    .startOf('day')
    .toDate();
}
