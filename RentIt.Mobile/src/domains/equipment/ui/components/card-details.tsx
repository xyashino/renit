import { Text } from '@/src/shared/ui/components/text';
import { formatCategoryLabels } from '@/src/shared/domain/category';
import type { Equipment } from '@/src/shared/domain/equipment';
import { ScrollView, View } from 'react-native';

type Props = {
  item: Equipment;
};

export function CardDetails({ item }: Props) {
  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-6"
    >
      <View className="shrink-0">
        <Text variant="small" className="text-muted-foreground text-xs">Stawka dzienna</Text>
        <Text variant="small" className="text-foreground font-bold mt-0.5">{item.pricePerDay} zł/dzień</Text>
      </View>
      {item.deposit > 0 ? (
        <View className="shrink-0">
          <Text variant="small" className="text-muted-foreground text-xs">Kaucja</Text>
          <Text variant="small" className="text-foreground font-bold mt-0.5">{item.deposit} zł</Text>
        </View>
      ) : null}
      {item.categories?.length ? (
        <View className="shrink-0">
          <Text variant="small" className="text-muted-foreground text-xs">Kategorie</Text>
          <Text variant="small" className="text-foreground font-bold mt-0.5">
            {formatCategoryLabels(item.categories)}
          </Text>
        </View>
      ) : null}
      {item.address ? (
        <View className="shrink-0 max-w-full">
          <Text variant="small" className="text-muted-foreground text-xs">Adres</Text>
          <Text variant="small" className="text-foreground font-bold mt-0.5">{item.address}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
