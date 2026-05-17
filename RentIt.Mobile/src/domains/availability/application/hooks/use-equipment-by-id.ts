import { loadEquipmentById } from '@/src/shared/infrastructure/equipment';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useEquipmentById(equipmentId: number) {
  const { data: equipment } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => loadEquipmentById(equipmentId),
  });

  return { equipment };
}
