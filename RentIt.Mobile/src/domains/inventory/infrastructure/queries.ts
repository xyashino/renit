import type { Category } from '@/src/shared/domain/category';
import type { Equipment } from '@/src/shared/domain/equipment';
import {
  loadCategories,
  loadEquipmentById,
  loadMyEquipment,
} from '@/src/shared/infrastructure/equipment';

export async function getMyEquipment(): Promise<Equipment[]> {
  return loadMyEquipment();
}

export async function getEquipmentById(id: number): Promise<Equipment> {
  return loadEquipmentById(id);
}

export async function getCategories(): Promise<Category[]> {
  return loadCategories();
}
