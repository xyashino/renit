import { RENTAL_STATUSES, type RentalStatus, type RentalStatusKey } from '../constants';

export type { RentalStatus, RentalStatusKey } from '../constants';
export { RENTAL_STATUSES } from '../constants';

export function findRentalStatusById(id: number): RentalStatus | undefined {
  return RENTAL_STATUSES.find((status) => status.id === id);
}

export function findRentalStatusId(key: RentalStatusKey): number | undefined {
  return RENTAL_STATUSES.find((status) => status.key === key)?.id;
}

export function parseRentalStatusId(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase();
    const byKey = RENTAL_STATUSES.find((status) => status.key === normalized);
    if (byKey) return byKey.id;
    const byLabel = RENTAL_STATUSES.find(
      (status) => status.label.toLowerCase() === normalized,
    );
    if (byLabel) return byLabel.id;
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}
