import { useAuth } from '@/src/shared/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { addFavorite, removeFavorite } from '../../infrastructure/commands';
import { getFavorites } from '../../infrastructure/queries';

export function useFavoriteToggle(equipmentId: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const favoritesQueryKey = ['favorites', user?.userId];

  const { data: favorites = [] } = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: () => getFavorites(),
    enabled: !!user,
  });

  const isFavorite = favorites.some((item) => item.id === equipmentId);

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Zaloguj się, aby dodać do ulubionych');
      if (isFavorite) {
        await removeFavorite(equipmentId);
        return;
      }
      await addFavorite(equipmentId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoritesQueryKey }),
    onError: (error) => {
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Spróbuj ponownie');
    },
  });

  return {
    isFavorite,
    toggleFavorite: () => favoriteMutation.mutate(),
    isFavoritePending: favoriteMutation.isPending,
  };
}
