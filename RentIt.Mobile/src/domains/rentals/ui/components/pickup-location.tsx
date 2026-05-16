import { THEME } from '@/src/shared/constants/theme';
import { Text } from '@/src/shared/ui/components/text';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

const T = THEME.light;

type Props = {
  address: string;
};

export function PickupLocation({ address }: Props) {
  return (
    <View className="rounded-xl border border-border bg-card p-3 gap-1.5">
      <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        Miejsce odbioru
      </Text>
      <View className="flex-row items-start gap-2">
        <MaterialIcons name="location-on" size={20} color={T['muted-foreground']} style={{ marginTop: 1 }} />
        <View className="flex-1">
          <Text className="text-foreground leading-6">{address}</Text>
          <Text variant="small" className="text-muted-foreground mt-1">
            Tu odbierzesz sprzęt u właściciela we wskazanym terminie.
          </Text>
        </View>
      </View>
    </View>
  );
}
