import type { Equipment } from '@/src/shared/domain/equipment';
import {
  equipmentWritePayloadSchema,
  type EquipmentWritePayload,
} from '../schemas/api';
import type { EquipmentFormData } from '../schemas/forms';

export function equipmentToFormData(equipment: Equipment): EquipmentFormData {
  return {
    name: equipment.name ?? '',
    description: equipment.description ?? '',
    imageUrl: equipment.imageUrl ?? '',
    price: String(equipment.pricePerDay ?? 0),
    deposit: String(equipment.deposit ?? 0),
    address: equipment.address ?? '',
    categoryIds: equipment.categories?.map((category) => category.id) ?? [],
  };
}

export function toEquipmentWritePayload(
  data: EquipmentFormData,
  statusId: number
): EquipmentWritePayload {
  return equipmentWritePayloadSchema.parse({
    name: data.name.trim(),
    description: data.description?.trim() || undefined,
    imageUrl: data.imageUrl.trim() || undefined,
    pricePerDay: Number(data.price),
    deposit: Number(data.deposit) || 0,
    address: data.address.trim(),
    statusId,
    categoryIds: data.categoryIds,
  });
}
