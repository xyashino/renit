import { useCurrentUser } from '@/src/shared/auth/session';
import { addFavorite, getEquipmentById, getFavorites, removeFavorite } from '../../infrastructure';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

export function useProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const equipmentId = Number(id);

  const { data: equipment, isError } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  const favoritesQueryKey = ['favorites', user?.userId];
  const { data: favorites = [] } = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: () => getFavorites(user!.userId),
    enabled: !!user,
  });
  const isFavorite = favorites.some((favorite) => favorite.equipmentId === equipmentId);

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Nie jesteś zalogowany');
      if (isFavorite) {
        await removeFavorite(user.userId, equipmentId);
        return;
      }
      await addFavorite(user.userId, equipmentId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoritesQueryKey }),
    onError: (error) => {
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Spróbuj ponownie');
    },
  });

  return {
    equipment,
    isFavorite,
    toggleFavorite: () => favoriteMutation.mutate(),
    isFavoritePending: favoriteMutation.isPending,
    isError,
    goBack: () => router.back(),
  };
}
