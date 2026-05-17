import { Text } from '@/src/shared/ui/components/text';
import type { Equipment } from '@/src/shared/domain/equipment';
import { View } from 'react-native';
import { EquipmentImage } from './image';

type Props = {
  item: Equipment;
};

export function EquipmentCardHeader({ item }: Props) {
  return (
    <View className="w-full h-44 border-b border-border bg-accent items-center justify-center">
      <EquipmentImage imageUrl={item.imageUrl} imageClassName="absolute inset-0" />
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-black/30 items-start justify-end p-3">
        <Text variant="large" className="font-bold text-white" numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </View>
  );
}
