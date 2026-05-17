import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import {
  createAvailabilityBlockRequestSchema,
  equipmentAvailabilityBlockDtoSchema,
  type CreateAvailabilityBlockRequest,
} from '../application/schemas/api';
import type { EquipmentAvailabilityBlock } from '../domain/availability-block';
import { mapEquipmentAvailabilityBlock } from './mappers';

export async function createAvailabilityBlock(
  body: CreateAvailabilityBlockRequest
): Promise<EquipmentAvailabilityBlock> {
  const payload = createAvailabilityBlockRequestSchema.parse(body);
  const { data, error } = await apiClient.POST('/api/equipment-availability-blocks', {
    body: {
      equipmentId: payload.equipmentId,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      reason: payload.reason ?? '',
    },
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się dodać blokady'));
  }
  const dto = parseApiItem(
    equipmentAvailabilityBlockDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (blokady)'
  );
  return mapEquipmentAvailabilityBlock(dto);
}

export async function deleteAvailabilityBlock(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/equipment-availability-blocks/{id}', {
    params: { path: { id } },
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się usunąć blokady'));
  }
}
