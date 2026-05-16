import { useAuth } from '@/src/shared/auth';
import { getClientRentals, getOwnerRentals } from '../../infrastructure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { RentalTab } from '../../constants';
import { filterRentalsByTab } from './rental-list-utils';

export function useRentalsList() {
  const { status } = useLocalSearchParams<{ status?: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isOwner = user?.accountType === 'owner';

  const activeTab: RentalTab =
    status === 'active' || status === 'pending' || status === 'history' ? status : 'active';

  const { data: allRentals = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['rentals', isOwner ? 'owner' : 'client', user?.userId, 'equipment'],
    queryFn: () =>
      isOwner ? getOwnerRentals(user!.userId) : getClientRentals(user!.userId),
  });

  const rentals = filterRentalsByTab(allRentals, activeTab);

  function handleTabChange(tab: RentalTab) {
    router.setParams({ status: tab });
  }

  return { activeTab, handleTabChange, rentals, isError, refetch, isOwner };
}
