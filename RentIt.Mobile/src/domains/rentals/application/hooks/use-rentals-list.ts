import { filterClientRentals, filterOwnerRentals } from '../mappers/rental-list';
import { getMyRentals } from '../../infrastructure/queries';
import { useAuth } from '@/src/shared/auth';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { RentalTab } from '../../constants';
import { filterRentalsByTab } from './rental-list-utils';

export function useRentalsList() {
  const { status } = useLocalSearchParams<{ status?: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isOwner = user?.accountType === 'owner';
  const userId = user?.userId;

  const activeTab: RentalTab =
    status === 'active' || status === 'pending' || status === 'history' ? status : 'active';

  const { data: allRentals = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['rentals', isOwner ? 'owner' : 'client', userId],
    queryFn: async () => {
      if (userId == null) throw new Error('Nie jesteś zalogowany');
      const rentals = await getMyRentals();
      return isOwner ? filterOwnerRentals(rentals, userId) : filterClientRentals(rentals, userId);
    },
  });

  const rentals = filterRentalsByTab(allRentals, activeTab);

  function handleTabChange(tab: RentalTab) {
    router.setParams({ status: tab });
  }

  return { activeTab, handleTabChange, rentals, isError, refetch, isOwner };
}
