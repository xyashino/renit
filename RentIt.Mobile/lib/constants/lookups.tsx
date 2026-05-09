import type { Category, Status } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 1, key: 'electronics', label: 'Elektronika', icon: 'devices' },
  { id: 2, key: 'tools', label: 'Narzędzia', icon: 'handyman' },
  { id: 3, key: 'construction', label: 'Budownictwo', icon: 'construction' },
  { id: 4, key: 'garden', label: 'Ogrody', icon: 'outdoor-grill' },
  { id: 5, key: 'sports-and-recreation', label: 'Sport i rekreacja', icon: 'celebration' },
];

export const STATUSES: Status[] = [
  { id: 1, key: 'available', label: 'Dostępny' },
  { id: 2, key: 'rented', label: 'Wypożyczony' },
  { id: 3, key: 'unavailable', label: 'Niedostępny' },
];

export function findCategoryById(id: number): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function findStatusById(id: number): Status | undefined {
  return STATUSES.find((status) => status.id === id);
}

export function findStatusId(key: Status['key']): number | undefined {
  return STATUSES.find((status) => status.key === key)?.id;
}
