import type { Rental } from '../domain';
import { findRentalStatusById, parseRentalStatusId } from '../domain';
import { rentalDtoSchema, type RentalDto } from '../application/schemas/api';
import { parseApiArray, parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { tryParseEquipmentItem } from '@/src/shared/infrastructure/equipment';

function mapRentalDto(dto: RentalDto): Rental {
  const id = dto.id;
  const dateFrom = dto.dateFrom;
  const dateTo = dto.dateTo;
  const clientId = dto.clientId;
  const equipmentId = dto.equipmentId;

  if (id == null || !dateFrom || !dateTo || clientId == null || equipmentId == null) {
    throw new Error('Nieprawidłowa odpowiedź API (wypożyczenie)');
  }

  const statusId = parseRentalStatusId(dto.status) ?? 0;
  const client = dto.client;

  return {
    id,
    dateFrom,
    dateTo,
    notes: dto.notes ?? '',
    address: dto.address ?? '',
    clientId,
    equipmentId,
    statusId,
    status: findRentalStatusById(statusId),
    client:
      client?.id != null
        ? {
            id: client.id,
            firstName: client.firstName ?? '',
            lastName: client.lastName ?? '',
            email: client.email ?? '',
          }
        : undefined,
    equipment: tryParseEquipmentItem(dto.equipment),
  };
}

export function parseRentalList(data: unknown): Rental[] {
  return parseApiArray(rentalDtoSchema, data, 'Nieprawidłowa odpowiedź API (wypożyczenia)').map(
    mapRentalDto
  );
}

export function parseRentalItem(data: unknown): Rental {
  const dto = parseApiItem(rentalDtoSchema, data, 'Nieprawidłowa odpowiedź API (wypożyczenie)');
  return mapRentalDto(dto);
}
