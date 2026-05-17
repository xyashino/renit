import { getEquipmentById } from '../../infrastructure/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useEquipmentById(equipmentId: number) {
  const { data: equipment } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  return { equipment };
}
