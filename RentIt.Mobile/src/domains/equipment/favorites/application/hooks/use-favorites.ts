import { useAuth } from '@/src/shared/auth';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../../infrastructure/queries';

export function useFavorites() {
  const { user } = useAuth();

  const { data: favorites = [], isError, isPending, refetch } = useQuery({
    queryKey: ['favorites', user?.userId],
    queryFn: () => getFavorites(),
    enabled: user?.userId != null,
  });

  return { favorites, isError, isPending: user?.userId != null && isPending, refetch };
}
