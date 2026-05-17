import type { Category } from '@/src/shared/domain/category';
import type { Equipment } from '@/src/shared/domain/equipment';
import {
  loadCategories,
  loadEquipmentById,
  loadEquipmentList,
} from '@/src/shared/infrastructure/equipment';

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
