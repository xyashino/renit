import { apiClient } from '@/src/shared/api/client';
import {
  categoryDtoSchema,
  equipmentDtoSchema,
  type EquipmentDto,
} from '@/src/shared/application/schemas/equipment';
import { mapCategory, mapCategoryList } from '@/src/shared/domain/category';
import type { Category } from '@/src/shared/domain/category';
import { findStatusById } from '@/src/shared/domain';
import type { Equipment } from '@/src/shared/domain/equipment';
import { parseApiArray } from './parse-api';

function mapCategories(dto: Record<string, unknown>): Category[] | undefined {
  const raw = dto.categories;
  if (!Array.isArray(raw)) return undefined;
  const categories = raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const category = item as Record<string, unknown>;
      const id = Number(category.id);
      if (!Number.isFinite(id)) return null;
      return mapCategory({
        id,
        name: String(category.name ?? ''),
        key: String(category.key ?? ''),
      });
    })
    .filter((category): category is Category => category != null);
  return categories.length > 0 ? categories : [];
}

function mapEquipment(dto: Record<string, unknown>): Equipment {
  const imageUrl = dto.imageUrl ?? dto.ImageUrl;
  const statusRaw = dto.status ?? dto.Status;

  return {
    id: Number(dto.id ?? dto.Id),
    name: String(dto.name ?? dto.Name ?? ''),
    description: dto.description != null ? String(dto.description) : '',
    imageUrl: imageUrl != null && imageUrl !== '' ? String(imageUrl) : undefined,
    pricePerDay: Number(dto.pricePerDay ?? dto.PricePerDay ?? 0),
    deposit: Number(dto.deposit ?? dto.Deposit ?? 0),
    address: String(dto.address ?? dto.Address ?? ''),
    userId: Number(dto.userId ?? dto.UserId),
    statusId: Number(statusRaw),
    status: findStatusById(Number(statusRaw)),
    categories: mapCategories(dto),
  };
}

function normalizeEquipmentListPayload(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    if (Array.isArray(obj.$values)) return obj.$values as Record<string, unknown>[];
  }
  return [];
}

function mapEquipmentDto(dto: EquipmentDto): Equipment {
  const equipment = mapEquipment(dto as Record<string, unknown>);
  if (!Number.isFinite(equipment.id)) {
    throw new Error('Nieprawidłowa odpowiedź API (sprzęt)');
  }
  return equipment;
}

export function parseEquipmentList(data: unknown): Equipment[] {
  return normalizeEquipmentListPayload(data).map((item) => {
    const parsed = equipmentDtoSchema.safeParse(item);
    if (!parsed.success) {
      throw new Error('Nieprawidłowa odpowiedź API (sprzęt)');
    }
    return mapEquipmentDto(parsed.data);
  });
}

export function parseEquipmentItem(data: unknown): Equipment {
  const parsed = equipmentDtoSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Nieprawidłowa odpowiedź API (sprzęt)');
  }
  return mapEquipmentDto(parsed.data);
}

/** Nie rzuca — używane przy zagnieżdżonym sprzęcie w wypożyczeniach. */
export function tryParseEquipmentItem(data: unknown): Equipment | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const parsed = equipmentDtoSchema.safeParse(data);
  if (parsed.success) {
    try {
      return mapEquipmentDto(parsed.data);
    } catch {
      // fallback poniżej
    }
  }

  try {
    const equipment = mapEquipment(data as Record<string, unknown>);
    return Number.isFinite(equipment.id) ? equipment : undefined;
  } catch {
    return undefined;
  }
}

export function parseCategoryList(data: unknown): Category[] {
  const items = parseApiArray(categoryDtoSchema, data, 'Nieprawidłowa odpowiedź API (kategorie)');
  return mapCategoryList(items);
}

export type EquipmentListQuery = {
  city?: string;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
};

function buildEquipmentListQuery(params?: EquipmentListQuery): Record<string, string | number> | undefined {
  if (!params) return undefined;
  const query: Record<string, string | number> = {};
  if (params.city) query.city = params.city;
  if (params.categoryId != null) query.category = params.categoryId;
  if (params.dateFrom) query.dateFrom = params.dateFrom;
  if (params.dateTo) query.dateTo = params.dateTo;
  return Object.keys(query).length > 0 ? query : undefined;
}

/** GET /api/equipment — używane przez equipment-catalog, owner-inventory, rentals. */
export async function loadEquipmentList(params?: EquipmentListQuery): Promise<Equipment[]> {
  const query = buildEquipmentListQuery(params);
  const { data, error } = await apiClient.GET('/api/equipment', {
    params: query ? { query: query as never } : undefined,
  });
  if (error) throw new Error('Nie udało się załadować sprzętu');
  return parseEquipmentList(data);
}

/** GET /api/equipment/{id} */
export async function loadEquipmentById(id: number): Promise<Equipment> {
  const { data, error } = await apiClient.GET('/api/equipment/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować sprzętu');
  return parseEquipmentItem(data);
}

/** GET /api/categories */
export async function loadCategories(): Promise<Category[]> {
  const { data, error } = await apiClient.GET('/api/categories' as never);
  if (error) throw new Error('Nie udało się załadować kategorii');
  return parseCategoryList(data);
}
