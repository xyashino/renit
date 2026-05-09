import { useAuth } from '@/context/auth';
import { getRentals } from '@/services/rentals';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';

export type RentalTab = 'active' | 'pending' | 'history';

export const RENTAL_TABS: { key: RentalTab; label: string }[] = [
  { key: 'active', label: 'Aktywne' },
  { key: 'pending', label: 'Oczekujące' },
  { key: 'history', label: 'Historia' },
];

function rentalStatusToTab(statusKey: string | undefined): RentalTab {
  switch (statusKey) {
    case 'rented': return 'active';
    case 'unavailable': return 'pending';
    case 'available': return 'history';
    default: return 'history';
  }
}

export function useMyRentals() {
  const { status } = useLocalSearchParams<{ status?: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const activeTab: RentalTab =
    status === 'active' || status === 'pending' || status === 'history' ? status : 'active';

  const { data: allRentals = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['rentals'],
    queryFn: getRentals,
  });

  const myRentals = allRentals.filter((r) => r.clientId === user?.userId);
  const rentals = myRentals.filter((r) => rentalStatusToTab(r.status?.key) === activeTab);

  function handleTabChange(tab: RentalTab) {
    router.setParams({ status: tab });
  }

  return { activeTab, handleTabChange, rentals, isError, refetch };
}
