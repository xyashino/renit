import type { Rental } from '../../domain';
import type { RentalTab } from '../../constants';
import type { RentalStatusKey } from '../../domain';

export function rentalStatusToTab(statusKey: RentalStatusKey | undefined): RentalTab {
  switch (statusKey) {
    case 'active':
      return 'active';
    case 'pending':
      return 'pending';
    case 'completed':
    case 'cancelled':
      return 'history';
    default:
      return 'history';
  }
}

export function filterRentalsByTab(rentals: Rental[], activeTab: RentalTab): Rental[] {
  return rentals.filter((rental) => rentalStatusToTab(rental.status?.key) === activeTab);
}
