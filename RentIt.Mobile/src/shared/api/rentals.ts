import type { Rental } from '@rentals/domain';
import { apiClient } from './client';
import { findStatusById } from '../domain';

function mapRental(dto: any): Rental {
  return {
    id: Number(dto.id),
    dateFrom: dto.dateFrom,
    dateTo: dto.dateTo,
    notes: dto.notes ?? '',
    address: dto.address,
    clientId: Number(dto.clientId),
    equipmentId: Number(dto.equipmentId),
    statusId: Number(dto.status),
    status: findStatusById(Number(dto.status)),
    client: dto.client
      ? {
          id: Number(dto.client.id),
          firstName: dto.client.firstName,
          lastName: dto.client.lastName,
          email: dto.client.email,
          address: dto.client.address,
        }
      : undefined,
  };
}

export async function getRentals(): Promise<Rental[]> {
  const { data, error } = await apiClient.GET('/api/rentals');
  if (error) throw new Error('Nie udało się załadować wypożyczeń');
  return (data ?? []).map(mapRental);
}

export async function getRentalById(id: number): Promise<Rental> {
  const { data, error } = await apiClient.GET('/api/rentals/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować wypożyczenia');
  return mapRental(data);
}

export async function createRental(body: {
  dateFrom: string;
  dateTo: string;
  notes?: string;
  address: string;
  clientId: number;
  equipmentId: number;
  statusId: number;
}): Promise<Rental> {
  const { data, error } = await apiClient.POST('/api/rentals', {
    body: {
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
      notes: body.notes ?? '',
      address: body.address,
      clientId: body.clientId,
      equipmentId: body.equipmentId,
      status: body.statusId,
    },
  });
  if (error) throw new Error('Nie udało się złożyć rezerwacji');
  return mapRental(data);
}

export async function updateRentalStatus(id: number, statusId: number): Promise<void> {
  const { error } = await apiClient.PATCH('/api/rentals/{id}/status', {
    params: { path: { id } },
    body: { status: statusId } as any,
  });
  if (error) throw new Error('Nie udało się zaktualizować statusu');
}

export async function deleteRental(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/rentals/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się usunąć wypożyczenia');
}
