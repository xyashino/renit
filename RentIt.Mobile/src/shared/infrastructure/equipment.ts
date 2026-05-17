import { apiClient } from '@/src/shared/api/client';
import {
  categoryDtoSchema,
  equipmentDtoSchema,
  type EquipmentDto,
} from '@/src/shared/application/schemas/equipment';
import { findStatusById } from '@/src/shared/domain';
import type { Category } from '@/src/shared/domain/category';
import { mapCategoryList } from '@/src/shared/domain/category';
import type { Equipment } from '@/src/shared/domain/equipment';
import { parseApiArray, parseApiItem } from './parse-api';

function mapEquipmentDto(dto: EquipmentDto): Equipment {
  const id = dto.id;
  const userId = dto.userId;
  if (id == null || userId == null) {
    throw new Error('Nieprawidłowa odpowiedź API (sprzęt)');
  }

  const statusId = dto.status ?? 0;
  const imageUrl = dto.imageUrl;

  return {
    id,
    name: dto.name ?? '',
    description: dto.description,
    imageUrl: imageUrl != null && imageUrl !== '' ? imageUrl : undefined,
    pricePerDay: Number(dto.pricePerDay ?? 0),
    deposit: Number(dto.deposit ?? 0),
    address: dto.address ?? '',
    userId,
    statusId,
    status: findStatusById(statusId),
    categories: dto.categories ? mapCategoryList(dto.categories) : undefined,
  };
}

export function parseEquipmentList(data: unknown): Equipment[] {
  return parseApiArray(equipmentDtoSchema, data, 'Nieprawidłowa odpowiedź API (sprzęt)').map(
    mapEquipmentDto
  );
}

export function parseEquipmentItem(data: unknown): Equipment {
  const dto = parseApiItem(equipmentDtoSchema, data, 'Nieprawidłowa odpowiedź API (sprzęt)');
  return mapEquipmentDto(dto);
}

export function tryParseEquipmentItem(data: unknown): Equipment | undefined {
  const parsed = equipmentDtoSchema.safeParse(data);
  if (!parsed.success) return undefined;
  try {
    return mapEquipmentDto(parsed.data);
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

function buildEquipmentListQuery(
  params?: EquipmentListQuery
): { city?: string; category?: number; dateFrom?: string; dateTo?: string } | undefined {
  if (!params) return undefined;
  const query: { city?: string; category?: number; dateFrom?: string; dateTo?: string } = {};
  if (params.city) query.city = params.city;
  if (params.categoryId != null) query.category = params.categoryId;
  if (params.dateFrom) query.dateFrom = params.dateFrom;
  if (params.dateTo) query.dateTo = params.dateTo;
  return Object.keys(query).length > 0 ? query : undefined;
}

export async function loadMyEquipment(): Promise<Equipment[]> {
  const { data, error } = await apiClient.GET('/api/equipment/mine');
  if (error) throw new Error('Nie udało się załadować Twojego sprzętu');
  return parseEquipmentList(data);
}

export async function loadEquipmentList(params?: EquipmentListQuery): Promise<Equipment[]> {
  const query = buildEquipmentListQuery(params);
  const { data, error } = await apiClient.GET('/api/equipment', {
    params: query ? { query } : undefined,
  });
  if (error) throw new Error('Nie udało się załadować sprzętu');
  return parseEquipmentList(data);
}

export async function loadEquipmentById(id: number): Promise<Equipment> {
  const { data, error } = await apiClient.GET('/api/equipment/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować sprzętu');
  return parseEquipmentItem(data);
}

/** GET /api/categories */
export async function loadCategories(): Promise<Category[]> {
  const { data, error } = await apiClient.GET('/api/categories');
  if (error) throw new Error('Nie udało się załadować kategorii');
  return parseCategoryList(data);
}
