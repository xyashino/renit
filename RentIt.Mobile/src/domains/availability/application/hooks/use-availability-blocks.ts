import { useAvailabilityBlockForm } from './use-availability-block-form';
import { useAvailabilityBlocksList } from './use-availability-blocks-list';
import { useEquipmentById } from './use-equipment-by-id';

export function useAvailabilityBlocks(equipmentId: number) {
  const { equipment } = useEquipmentById(equipmentId);
  const { blocks, blocksQueryKey } = useAvailabilityBlocksList(equipmentId);
  const formState = useAvailabilityBlockForm(equipmentId, blocksQueryKey);

  return {
    equipment,
    blocks,
    ...formState,
  };
}
