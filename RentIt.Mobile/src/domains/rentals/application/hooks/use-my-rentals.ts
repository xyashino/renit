import { useCurrentUser } from '@/src/shared/auth/session';
import { getRentals } from '../../infrastructure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { type RentalTab } from '../../constants';

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
  const user = useCurrentUser();

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
