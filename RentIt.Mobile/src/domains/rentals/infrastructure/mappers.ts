import type { Rental } from '../domain';
import { findRentalStatusById, parseRentalStatusId } from '../domain';
import { rentalDtoSchema, type RentalDto } from '../application/schemas/api';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { tryParseEquipmentItem } from '@/src/shared/infrastructure/equipment';
import { z } from 'zod';

function normalizeRentalListPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.$values)) return obj.$values;
  }
  return [];
}

function mapRentalDto(dto: RentalDto): Rental {
  const statusId = parseRentalStatusId(dto.status);
  const client = dto.client;

  return {
    id: Number(dto.id),
    dateFrom: String(dto.dateFrom),
    dateTo: String(dto.dateTo),
    notes: String(dto.notes ?? ''),
    address: String(dto.address ?? ''),
    clientId: Number(dto.clientId),
    equipmentId: Number(dto.equipmentId),
    statusId: statusId ?? 0,
    status: statusId != null ? findRentalStatusById(statusId) : undefined,
    client: client
      ? {
          id: Number(client.id),
          firstName: String(client.firstName),
          lastName: String(client.lastName),
          email: String(client.email),
        }
      : undefined,
    equipment: tryParseEquipmentItem(dto.equipment),
  };
}

export function parseRentalList(data: unknown): Rental[] {
  const items = normalizeRentalListPayload(data);
  const result = z.array(rentalDtoSchema).safeParse(items);
  if (!result.success) {
    throw new Error('Nieprawidłowa odpowiedź API (wypożyczenia)');
  }
  return result.data.map(mapRentalDto);
}

export function parseRentalItem(data: unknown): Rental {
  const dto = parseApiItem(rentalDtoSchema, data, 'Nieprawidłowa odpowiedź API (wypożyczenie)');
  return mapRentalDto(dto);
}
