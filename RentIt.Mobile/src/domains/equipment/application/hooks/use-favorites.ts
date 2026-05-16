import { useAuth } from '@/src/shared/auth';
import { getFavorites } from '../../infrastructure/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useFavorites() {
  const { user } = useAuth();

  const { data: favorites = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['favorites', user?.userId],
    queryFn: () => getFavorites(user!.userId),
  });

  return { favorites, isError, refetch };
}
