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
