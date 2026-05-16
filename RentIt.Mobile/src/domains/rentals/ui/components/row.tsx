import { Button } from '@/src/shared/ui/components/button';
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
  clientName: string;
  status: RentalStatusKey;
  onPress: () => void;
  showPendingActions?: boolean;
  showCompleteAction?: boolean;
  onConfirm?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
  actionsDisabled?: boolean;
};

export function Row({
  rental,
  clientName,
  status,
  onPress,
  showPendingActions,
  showCompleteAction,
  onConfirm,
  onReject,
  onComplete,
  actionsDisabled,
}: Props) {
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <View className="bg-card rounded-xl border border-border p-4 gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full bg-accent items-center justify-center">
              <MaterialIcons name="person" size={18} color={T['accent-foreground']} />
            </View>
            <Text className="text-foreground font-semibold text-sm">{clientName}</Text>
          </View>
          <StatusBadge status={status} />
        </View>

        <View className="flex-row items-center gap-2">
          <MaterialIcons name="calendar-today" size={14} color={T['muted-foreground']} />
          <Text className="text-muted-foreground text-sm">
            {formatDate(rental.dateFrom)} – {formatDate(rental.dateTo)}
          </Text>
        </View>

        {rental.notes ? (
          <Text className="text-muted-foreground text-xs bg-muted rounded-lg px-3 py-2" numberOfLines={2}>
            {rental.notes}
          </Text>
        ) : null}

        {showPendingActions ? (
          <View className="flex-row gap-2">
            <Button
              className="flex-1 rounded-xl"
              size="sm"
              onPress={(e) => {
                e?.stopPropagation?.();
                onConfirm?.();
              }}
              disabled={actionsDisabled}
            >
              <MaterialIcons name="check" size={16} color={T['primary-foreground']} />
              <Text className="text-primary-foreground font-semibold ml-1">Potwierdź</Text>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onPress={(e) => {
                e?.stopPropagation?.();
                onReject?.();
              }}
              disabled={actionsDisabled}
              className="flex-1 rounded-xl"
            >
              <MaterialIcons name="close" size={16} color={T['destructive-foreground']} />
              <Text className="text-destructive-foreground font-semibold ml-1">Odrzuć</Text>
            </Button>
          </View>
        ) : showCompleteAction ? (
          <Button
            variant="outline"
            size="sm"
            onPress={(e) => {
              e?.stopPropagation?.();
              onComplete?.();
            }}
            disabled={actionsDisabled}
            className="rounded-xl"
          >
            <MaterialIcons name="history" size={16} color={T.foreground} />
            <Text className="text-foreground font-semibold ml-1">Oznacz jako zwrócone</Text>
          </Button>
        ) : null}
      </View>
    </Pressable>
  );
}
