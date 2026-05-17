import type { Rental } from '../domain';
import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import {
  createRentalDtoSchema,
  updateRentalStatusDtoSchema,
} from '../application/schemas/api';
import { parseRentalItem } from './mappers';

export async function createRental(body: {
  dateFrom: string;
  dateTo: string;
  notes?: string;
  equipmentId: number;
}): Promise<Rental> {
  const payload = createRentalDtoSchema.parse({
    dateFrom: body.dateFrom,
    dateTo: body.dateTo,
    notes: body.notes ?? '',
    equipmentId: body.equipmentId,
  });

  const { data, error } = await apiClient.POST('/api/rentals', { body: payload });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się złożyć rezerwacji'));
  }
  return parseRentalItem(data);
}

export async function updateRentalStatus(id: number, statusId: number): Promise<void> {
  const body = updateRentalStatusDtoSchema.parse({ status: statusId });
  const { error } = await apiClient.PATCH('/api/rentals/{id}/status', {
    params: { path: { id } },
    body,
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się zaktualizować statusu'));
  }
}

export async function deleteRental(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/rentals/{id}', {
    params: { path: { id } },
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się usunąć wypożyczenia'));
  }
}
