import type { BlockedRange } from '@/src/domains/rentals/domain';
import { apiClient } from '@/src/shared/api/client';
import type { Category } from '@/src/shared/domain/category';
import type { Equipment } from '@/src/shared/domain/equipment';
import {
  loadCategories,
  loadEquipmentById,
  loadEquipmentList,
} from '@/src/shared/infrastructure/equipment';
import { parseApiArray } from '@/src/shared/infrastructure/parse-api';
import { mapBlockedRange, mapFavoriteEquipment, type FavoriteEquipment } from './mappers';
import {
  blockedRangeDtoSchema,
  favoriteEquipmentDtoSchema,
} from '../application/schemas/api';

export type { FavoriteEquipment };
export type EquipmentPricing = Pick<Equipment, 'id' | 'pricePerDay'>;

export async function getCategories(): Promise<Category[]> {
  return loadCategories();
}

export async function getEquipment(params?: {
  city?: string;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Equipment[]> {
  return loadEquipmentList(params);
}

export async function getEquipmentById(id: number): Promise<Equipment> {
  return loadEquipmentById(id);
}

export async function getEquipmentPricing(id: number): Promise<EquipmentPricing> {
  const equipment = await getEquipmentById(id);
  return {
    id: equipment.id,
    pricePerDay: equipment.pricePerDay,
  };
}

export async function getEquipmentBlockedRanges(
  equipmentId: number,
  dateFrom: string,
  dateTo: string
): Promise<BlockedRange[]> {
  const { data, error } = await apiClient.GET('/api/equipment/{id}/availability', {
    params: {
      path: { id: equipmentId },
      query: { dateFrom, dateTo },
    },
  });
  if (error) throw new Error('Nie udało się sprawdzić dostępności');
  const items = parseApiArray(
    blockedRangeDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (dostępność)'
  );
  return items.map(mapBlockedRange);
}

export async function getFavorites(userId: number): Promise<FavoriteEquipment[]> {
  const { data, error } = await apiClient.GET('/api/favorites' as never, {
    params: { query: { userId } },
  } as never);
  if (error) throw new Error('Nie udało się załadować ulubionych');
  const items = parseApiArray(
    favoriteEquipmentDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (ulubione)'
  );
  return items.map(mapFavoriteEquipment);
}
