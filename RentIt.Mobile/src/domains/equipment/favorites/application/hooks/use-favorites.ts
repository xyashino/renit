import { useAuth } from '@/src/shared/auth';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getFavorites } from '../../infrastructure/queries';

export function useFavorites() {
  const { user } = useAuth();

  const { data: favorites = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['favorites', user?.userId],
    queryFn: () => getFavorites(),
  });

  return { favorites, isError, refetch };
}
