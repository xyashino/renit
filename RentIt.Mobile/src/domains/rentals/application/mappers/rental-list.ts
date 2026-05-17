import type { Rental } from '../../domain';
import { loadEquipmentList } from '@/src/shared/infrastructure/equipment';

export function filterClientRentals(rentals: Rental[], clientId: number): Rental[] {
  return rentals.filter((rental) => rental.clientId === clientId);
}

export async function filterOwnerRentals(rentals: Rental[], ownerId: number): Promise<Rental[]> {
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
