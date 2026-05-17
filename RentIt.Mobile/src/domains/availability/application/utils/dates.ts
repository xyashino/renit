export function toIsoDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}
