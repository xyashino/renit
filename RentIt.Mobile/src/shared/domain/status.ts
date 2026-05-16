export type StatusKey = 'available' | 'rented' | 'unavailable';

export interface Status {
  id: number;
  key: StatusKey;
  label: string;
}

export const STATUSES: Status[] = [
  { id: 1, key: 'available', label: 'Dostępny' },
  { id: 2, key: 'rented', label: 'Wypożyczony' },
  { id: 3, key: 'unavailable', label: 'Niedostępny' },
];

export function findStatusById(id: number): Status | undefined {
  return STATUSES.find((status) => status.id === id);
}

export function findStatusByKey(key: StatusKey): Status | undefined {
  return STATUSES.find((status) => status.key === key);
}

export function findStatusId(key: StatusKey): number | undefined {
  return STATUSES.find((status) => status.key === key)?.id;
}
