import type { BlockedRange } from '../domain/blocked-range';
import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import { parseApiArray } from '@/src/shared/infrastructure/parse-api';
import {
  blockedRangeDtoSchema,
  equipmentAvailabilityBlockDtoSchema,
} from '../application/schemas/api';
import type { EquipmentAvailabilityBlock } from '../domain/availability-block';
import { mapEquipmentAvailabilityBlock } from './mappers';

export async function getAvailabilityBlocks(
  equipmentId: number
): Promise<EquipmentAvailabilityBlock[]> {
  const { data, error } = await apiClient.GET('/api/equipment-availability-blocks', {
    params: { query: { equipmentId } },
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się załadować blokad'));
  }
  const items = parseApiArray(
    equipmentAvailabilityBlockDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (blokady)'
  );
  return items.map(mapEquipmentAvailabilityBlock);
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
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się sprawdzić dostępności'));
  }
  const items = parseApiArray(
    blockedRangeDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (dostępność)'
  );
  return items.map((item) => ({ dateFrom: item.dateFrom, dateTo: item.dateTo }));
}
