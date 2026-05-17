import { getRentals } from '@/src/domains/rentals';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useEquipmentById } from './use-equipment-by-id';

export function useEquipmentRentals() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const equipmentId = Number(id);

  const { equipment } = useEquipmentById(equipmentId);

  const {
    data: equipmentRentals = [],
    isError,
    refetch,
  } = useSuspenseQuery({
    queryKey: ['rentals', 'equipment', equipmentId],
    queryFn: () => getRentals(equipmentId),
  });

  return { equipment, equipmentRentals, isError, refetch };
}
