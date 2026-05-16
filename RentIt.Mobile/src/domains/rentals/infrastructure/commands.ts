import type { Rental } from '../domain';
import { apiClient } from '@/src/shared/api/client';
import { parseRentalItem } from './mappers';

export async function createRental(body: {
  dateFrom: string;
  dateTo: string;
  notes?: string;
  equipmentId: number;
}): Promise<Rental> {
  const { data, error } = await apiClient.POST('/api/rentals', {
    body: {
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      notes: body.notes ?? '',
      equipmentId: body.equipmentId,
    } as never,
  });
  if (error) {
    const message =
      error !== null &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Nie udało się złożyć rezerwacji';
    throw new Error(message);
  }
  return parseRentalItem(data);
}

export async function updateRentalStatus(id: number, statusId: number): Promise<void> {
  const { error } = await apiClient.PATCH('/api/rentals/{id}/status', {
    params: { path: { id } },
    body: { status: statusId } as never,
  });
  if (error) throw new Error('Nie udało się zaktualizować statusu');
}

export async function deleteRental(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/rentals/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się usunąć wypożyczenia');
}
