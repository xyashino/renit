import { CardHeader, Image } from '@/src/domains/equipment';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { formatDate } from '@/src/shared/utils/date';
import type { Rental, RentalStatusKey } from '../../domain';
import { StatusBadge } from './badge';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

const T = THEME.light;

type Props = {
  rental: Rental;
  onPress: () => void;
};

export function Card({ rental, onPress }: Props) {
  const statusName: RentalStatusKey = rental.status?.key ?? 'pending';
  const equipment = rental.equipment;
  const equipmentName = equipment?.name?.trim();

  return (
    <Pressable onPress={onPress} className="bg-card rounded-xl overflow-hidden border border-border active:opacity-80">
      {equipment ? (
        <CardHeader item={equipment} />
      ) : (
        <View className="relative h-36 bg-accent items-center justify-center overflow-hidden">
          <Image imageUrl={undefined} imageClassName="absolute inset-0" iconSize={32} />
          <Text className="font-bold text-white text-base px-3">
            {equipmentName ?? `Sprzęt #${rental.equipmentId}`}
          </Text>
        </View>
      )}

      <View className="px-4 py-3 gap-3">
        <View className="flex-row items-center justify-end">
          <StatusBadge status={statusName} />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="calendar-today" size={14} color={T['muted-foreground']} />
            <Text className="text-muted-foreground text-sm">
              {formatDate(rental.dateFrom)} – {formatDate(rental.dateTo)}
            </Text>
          </View>
          {rental.address ? (
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="place" size={14} color={T['muted-foreground']} />
              <Text className="text-muted-foreground text-sm" numberOfLines={1}>
                {rental.address}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
