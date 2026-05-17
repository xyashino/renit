export interface Category {
  id: number;
  key: string;
  label: string;
}

const SUPPORTED_CATEGORY_KEYS = new Set([
  'electronics',
  'tools',
  'construction',
  'garden',
  'sports-and-recreation',
]);

export type CategoryDtoInput = {
  id?: number;
  name?: string;
  key?: string;
};

export function mapCategory(dto: CategoryDtoInput): Category | null {
  const id = dto.id;
  const key = String(dto.key ?? '').trim();
  const label = String(dto.name ?? '').trim();
  if (id == null || !Number.isFinite(id) || !key || !SUPPORTED_CATEGORY_KEYS.has(key)) {
    return null;
  }

  return { id, key, label };
}

export function mapCategoryList(items: CategoryDtoInput[]): Category[] {
  return items
    .map((item) => mapCategory(item))
    .filter((category): category is Category => category != null);
}

export function formatCategoryLabels(categories: Category[]): string {
  return categories.map((category) => category.label).join(', ');
}
