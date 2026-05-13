export type CategoryIconName =
  | 'devices'
  | 'handyman'
  | 'construction'
  | 'outdoor-grill'
  | 'celebration';

export interface Category {
  id: number;
  key: string;
  label: string;
  description?: string;
  icon: CategoryIconName;
}

export const CATEGORIES: Category[] = [
  { id: 1, key: 'electronics', label: 'Elektronika', icon: 'devices' },
  { id: 2, key: 'tools', label: 'Narzędzia', icon: 'handyman' },
  { id: 3, key: 'construction', label: 'Budownictwo', icon: 'construction' },
  { id: 4, key: 'garden', label: 'Ogrody', icon: 'outdoor-grill' },
  { id: 5, key: 'sports-and-recreation', label: 'Sport i rekreacja', icon: 'celebration' },
];

export function findCategoryById(id: number): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}
