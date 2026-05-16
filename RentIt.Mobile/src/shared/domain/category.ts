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

type CategoryDto = {
  id?: number;
  name?: string;
  key?: string;
  Id?: number;
  Name?: string;
  Key?: string;
};

function normalizeCategoryDto(dto: CategoryDto) {
  return {
    id: Number(dto.id ?? dto.Id),
    key: String(dto.key ?? dto.Key ?? '').trim(),
    label: String(dto.name ?? dto.Name ?? '').trim(),
  };
}

export function mapCategory(dto: CategoryDto): Category | null {
  const { id, key, label } = normalizeCategoryDto(dto);
  if (!Number.isFinite(id) || !key || !SUPPORTED_CATEGORY_KEYS.has(key)) return null;

  return { id, key, label };
}

export function mapCategoryList(items: CategoryDto[]): Category[] {
  return items
    .map((item) => mapCategory(item))
    .filter((category): category is Category => category != null);
}

export function findCategoryById(categories: Category[], id: number): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function formatCategoryLabels(categories: Category[]): string {
  return categories.map((category) => category.label).join(', ');
}
