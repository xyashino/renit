import type { Rental } from '../domain';
import { apiClient } from '@/src/shared/api/client';
import type { Equipment } from '@/src/shared/domain/equipment';
import { loadEquipmentById, loadEquipmentList } from '@/src/shared/infrastructure/equipment';
import { parseRentalItem, parseRentalList } from './mappers';

async function withEquipment(rentals: Rental[]): Promise<Rental[]> {
  const incomplete = rentals.filter((rental) => !rental.equipment?.name);
  if (incomplete.length === 0) return rentals;

  const byId = new Map<number, Equipment>();
  await Promise.all(
    [...new Set(incomplete.map((rental) => rental.equipmentId))].map(async (id) => {
      try {
        byId.set(id, await loadEquipmentById(id));
      } catch {
        // brak sprzętu w API
      }
    })
  );

  return rentals.map((rental) => ({
    ...rental,
    equipment: rental.equipment?.name ? rental.equipment : byId.get(rental.equipmentId) ?? rental.equipment,
  }));
}

export async function getRentals(equipmentId?: number): Promise<Rental[]> {
  const { data, error } = await apiClient.GET('/api/rentals', {
    params: equipmentId != null ? { query: { equipmentId } } : undefined,
  });
  if (error) throw new Error('Nie udało się załadować wypożyczeń');
  return withEquipment(parseRentalList(data));
}

export async function getRentalById(id: number): Promise<Rental> {
  const { data, error } = await apiClient.GET('/api/rentals/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować wypożyczenia');
  if (!data) throw new Error('Nie znaleziono wypożyczenia');
  const [rental] = await withEquipment([parseRentalItem(data)]);
  return rental;
}

export async function getClientRentals(clientId: number): Promise<Rental[]> {
  const rentals = await getRentals();
  return rentals.filter((rental) => rental.clientId === clientId);
}

export async function getOwnerRentals(ownerId: number): Promise<Rental[]> {
  const rentals = await getRentals();
  const hasEquipmentOwner = rentals.some((rental) => rental.equipment?.userId != null);

  if (hasEquipmentOwner) {
    return rentals.filter((rental) => rental.equipment?.userId === ownerId);
  }

  const ownerEquipmentIds = new Set(
    (await loadEquipmentList())
      .filter((item) => item.userId === ownerId)
      .map((item) => item.id)
  );
  return rentals.filter((rental) => ownerEquipmentIds.has(rental.equipmentId));
}
