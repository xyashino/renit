import { useAuth } from '@/src/shared/auth';
import type { Equipment } from '@/src/shared/domain/equipment';
import { equipmentDetailHref } from '../../constants';
import { getFavorites } from '../../infrastructure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';

export function useFavoritesList() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: favorites = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['favorites', user?.userId],
    queryFn: () => getFavorites(user!.userId),
  });

  const items = useMemo(
    () =>
      favorites
        .map((favorite) => favorite.equipment ?? null)
        .filter((item): item is Equipment => item != null),
    [favorites],
  );

  function openEquipment(id: number) {
    router.push(equipmentDetailHref(id));
  }

  return { items, isError, refetch, openEquipment };
}
