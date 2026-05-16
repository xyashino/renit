import { Card as UiCard, CardContent } from '@/src/shared/ui/components/card';
import {
  EquipmentListCardDetails,
  EquipmentListCardHeader,
} from '@/src/shared/ui/components/equipment';
import type { Equipment } from '@/src/shared/domain/equipment';
import { Pressable } from 'react-native';

type Props = { item: Equipment; onPress: () => void };

export function Card({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <UiCard className="w-full overflow-hidden py-0">
        <EquipmentListCardHeader item={item} />
        <CardContent className="px-4 pb-4 pt-4">
          <EquipmentListCardDetails item={item} />
        </CardContent>
      </UiCard>
    </Pressable>
  );
}
