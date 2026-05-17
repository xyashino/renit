import { getAvailabilityBlocks } from '../../infrastructure/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useAvailabilityBlocksList(equipmentId: number) {
  const blocksQueryKey = ['availability-blocks', equipmentId];

  const { data: blocks = [] } = useSuspenseQuery({
    queryKey: blocksQueryKey,
    queryFn: () => getAvailabilityBlocks(equipmentId),
  });

  return { blocks, blocksQueryKey };
}
