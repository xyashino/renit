import { getEquipmentById } from '../../infrastructure/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';

export function useEquipmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const equipmentId = Number(id);

  const { data: equipment, isError } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  return {
    equipment,
    equipmentId,
    isError,
    goBack: () => router.back(),
  };
}
