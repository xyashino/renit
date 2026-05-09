import { EquipmentImage } from '@/components/recipes/equipment-image';
import { Text } from '@/components/ui/text';
import { THEME } from '@/constants/theme';
import type { Equipment } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

const T = THEME.light;

type EquipmentCardItem = Equipment & {
  reviews?: Array<{ rating: number }>;
};

type Props = { item: EquipmentCardItem; onPress: () => void };

export function EquipmentCard({ item, onPress }: Props) {
  const avgRating =
    item.reviews && item.reviews.length > 0
      ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
      : null;

  return (
    <Pressable
      onPress={onPress}
      className="h-28 bg-card rounded-xl overflow-hidden border border-border active:opacity-80"
    >
      <View className="flex-row">
        <View className="w-28 h-28 bg-accent items-center justify-center">
          <EquipmentImage imageUrl={item.imageUrl} iconSize={40} />
        </View>
        <View className="flex-1 px-4 py-3 justify-between">
          <View className="gap-1">
            <Text className="text-foreground font-semibold text-sm leading-tight" numberOfLines={2}>
              {item.name}
            </Text>
            {item.address ? (
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="place" size={12} color={T['muted-foreground']} />
                <Text className="text-muted-foreground text-xs">{item.address}</Text>
              </View>
            ) : null}
            {item.category ? (
              <Text className="text-muted-foreground text-xs">{item.category.label}</Text>
            ) : null}
          </View>
          <View className="flex-row items-center justify-between">
            {avgRating != null ? (
              <View className="flex-row items-center gap-1 bg-accent px-2 py-0.5 rounded-full border border-border">
                <MaterialIcons name="star" size={12} color={T.primary} />
                <Text className="text-accent-foreground text-xs font-bold">{avgRating.toFixed(1)}</Text>
              </View>
            ) : (
              <View />
            )}
            <View className="flex-row items-baseline gap-0.5">
              <Text className="text-primary font-bold text-base">{item.pricePerDay} zł</Text>
              <Text className="text-muted-foreground text-xs">/dzień</Text>
            </View>
          </View>
        </View>
        <View className="w-10 items-center justify-center">
          <MaterialIcons name="chevron-right" size={20} color={T['muted-foreground']} />
        </View>
      </View>
    </Pressable>
  );
}
