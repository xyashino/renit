export function parseDate(str: string): Date | null {
  if (str.split('-').length !== 3) return null;
  const d = new Date(`${str}T00:00:00.000Z`);
  return isNaN(d.getTime()) ? null : d;
}

export function daysBetween(from: Date | string, to: Date | string): number {
  const f = typeof from === 'string' ? new Date(from) : from;
  const t = typeof to === 'string' ? new Date(to) : to;
  return Math.max(1, Math.ceil((t.getTime() - f.getTime()) / (1000 * 60 * 60 * 24)));
}
