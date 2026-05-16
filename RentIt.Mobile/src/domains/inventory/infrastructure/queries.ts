import { apiClient } from '@/src/shared/api/client';
import type { Category } from '@/src/shared/domain/category';
import type { Equipment } from '@/src/shared/domain/equipment';
import {
  loadCategories,
  loadEquipmentById,
  loadEquipmentList,
} from '@/src/shared/infrastructure/equipment';
import { parseApiArray } from '@/src/shared/infrastructure/parse-api';
import {
  mapEquipmentAvailabilityBlock,
  type EquipmentAvailabilityBlock,
} from './mappers';
import { equipmentAvailabilityBlockDtoSchema } from '../application/schemas/availability-block';

export type { EquipmentAvailabilityBlock };

export async function getEquipmentList(): Promise<Equipment[]> {
  return loadEquipmentList();
}

export async function getMyEquipment(ownerId: number): Promise<Equipment[]> {
  const all = await getEquipmentList();
  return all.filter((item) => item.userId === ownerId);
}

export async function getEquipmentById(id: number): Promise<Equipment> {
  return loadEquipmentById(id);
}

export async function getCategories(): Promise<Category[]> {
  return loadCategories();
}

export async function getEquipmentCategoryIds(equipmentId: number): Promise<number[]> {
  const equipment = await getEquipmentById(equipmentId);
  return equipment.categories?.map((category) => category.id) ?? [];
}

export async function getAvailabilityBlocks(
  equipmentId: number
): Promise<EquipmentAvailabilityBlock[]> {
  const { data, error } = await apiClient.GET('/api/equipment-availability-blocks' as never, {
    params: { query: { equipmentId } },
  } as never);
  if (error) throw new Error('Nie udało się załadować blokad');
  const items = parseApiArray(
    equipmentAvailabilityBlockDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (blokady)'
  );
  return items.map(mapEquipmentAvailabilityBlock);
}
