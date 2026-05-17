import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import type { Equipment } from '@/src/shared/domain/equipment';
import { parseEquipmentItem } from '@/src/shared/infrastructure/equipment';
import {
  toEquipmentApiBody,
  equipmentWritePayloadSchema,
  type EquipmentWritePayload,
} from '../application/schemas/api';

export async function createEquipment(body: EquipmentWritePayload): Promise<Equipment> {
  const payload = equipmentWritePayloadSchema.parse(body);
  const { data, error } = await apiClient.POST('/api/equipment', {
    body: toEquipmentApiBody(payload),
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się dodać sprzętu'));
  }
  return parseEquipmentItem(data);
}

export async function updateEquipment(id: number, body: EquipmentWritePayload): Promise<void> {
  const payload = equipmentWritePayloadSchema.parse(body);
  const { error } = await apiClient.PUT('/api/equipment/{id}', {
    params: { path: { id } },
    body: toEquipmentApiBody(payload),
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się zaktualizować sprzętu'));
  }
}

export async function deleteEquipment(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/equipment/{id}', {
    params: { path: { id } },
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się usunąć sprzętu'));
  }
}
