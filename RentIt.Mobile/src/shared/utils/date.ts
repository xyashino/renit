export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', options ?? { day: 'numeric', month: 'short' });
}
