import { apiClient } from '@/src/shared/api/client';
import type { Equipment } from '@/src/shared/domain/equipment';
import { parseEquipmentItem } from '@/src/shared/infrastructure/equipment';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import {
  mapEquipmentAvailabilityBlock,
  type EquipmentAvailabilityBlock,
} from './mappers';
import { equipmentAvailabilityBlockDtoSchema } from '../application/schemas/availability-block';

export type EquipmentWritePayload = {
  name: string;
  description?: string;
  imageUrl?: string;
  pricePerDay: number;
  deposit: number;
  address: string;
  statusId: number;
  categoryIds: number[];
};

function buildEquipmentBody(body: EquipmentWritePayload) {
  return {
    name: body.name,
    description: body.description ?? '',
    imageUrl: body.imageUrl ?? null,
    pricePerDay: body.pricePerDay,
    deposit: body.deposit,
    address: body.address,
    status: body.statusId,
    categoryIds: body.categoryIds,
  };
}

export async function createEquipment(
  body: EquipmentWritePayload & { userId: number }
): Promise<Equipment> {
  const { userId: _userId, ...payload } = body;
  const { data, error } = await apiClient.POST('/api/equipment', {
    body: buildEquipmentBody(payload),
  });
  if (error) throw new Error('Nie udało się dodać sprzętu');
  return parseEquipmentItem(data);
}

export async function updateEquipment(id: number, body: EquipmentWritePayload): Promise<void> {
  const { error } = await apiClient.PUT('/api/equipment/{id}', {
    params: { path: { id } },
    body: buildEquipmentBody(body),
  });
  if (error) throw new Error('Nie udało się zaktualizować sprzętu');
}

export async function deleteEquipment(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/equipment/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się usunąć sprzętu');
}

export async function createAvailabilityBlock(body: {
  equipmentId: number;
  dateFrom: string;
  dateTo: string;
  reason?: string;
}): Promise<EquipmentAvailabilityBlock> {
  const { data, error } = await apiClient.POST('/api/equipment-availability-blocks' as never, {
    body: {
      equipmentId: body.equipmentId,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      reason: body.reason ?? '',
    },
  } as never);
  if (error) throw new Error('Nie udało się dodać blokady');
  const dto = parseApiItem(
    equipmentAvailabilityBlockDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (blokady)'
  );
  return mapEquipmentAvailabilityBlock(dto);
}

export async function updateAvailabilityBlock(
  id: number,
  body: { dateFrom: string; dateTo: string; reason?: string }
): Promise<void> {
  const { error } = await apiClient.PUT('/api/equipment-availability-blocks/{id}' as never, {
    params: { path: { id } },
    body: {
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      reason: body.reason ?? '',
    },
  } as never);
  if (error) throw new Error('Nie udało się zaktualizować blokady');
}

export async function deleteAvailabilityBlock(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/equipment-availability-blocks/{id}' as never, {
    params: { path: { id } },
  } as never);
  if (error) throw new Error('Nie udało się usunąć blokady');
}
