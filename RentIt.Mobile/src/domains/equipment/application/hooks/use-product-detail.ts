import { getEquipmentById, getReviews } from '../../infrastructure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';

export function useProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const equipmentId = Number(id);

  const { data: equipment, isError } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  const { data: reviews = [] } = useSuspenseQuery({
    queryKey: ['reviews', equipmentId],
    queryFn: () => getReviews(equipmentId),
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return {
    equipment,
    reviews,
    avgRating,
    isError,
    goBack: () => router.back(),
  };
}
