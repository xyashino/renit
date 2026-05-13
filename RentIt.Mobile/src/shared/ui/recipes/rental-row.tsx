import { Badge } from '@/src/shared/ui/components/badge';
import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { findStatusId } from '@/src/shared/domain';
import { updateRentalStatus } from '@/src/shared/api/rentals';
import { formatDate } from '@/src/shared/utils/date';
import type { Rental } from '@rentals/domain';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, View } from 'react-native';

const T = THEME.light;

type StatusName = 'available' | 'rented' | 'unavailable';

const STATUS_CONFIG: Record<StatusName, { label: string; icon: React.ComponentProps<typeof MaterialIcons>['name']; color: string }> = {
  available: { label: 'Dostępny', icon: 'check-circle', color: T.primary },
  rented: { label: 'Aktywne', icon: 'check-circle', color: T.primary },
  unavailable: { label: 'Oczekujące', icon: 'schedule', color: T['muted-foreground'] },
};

type Props = {
  rental: Rental;
};

export function RentalRow({ rental }: Props) {
  const queryClient = useQueryClient();
  const statusName = (rental.status?.key ?? 'unavailable') as StatusName;
  const cfg = STATUS_CONFIG[statusName] ?? STATUS_CONFIG.unavailable;
  const isPending = statusName === 'unavailable';
  const isRented = statusName === 'rented';

  const mutation = useMutation({
    mutationFn: (newStatus: 'available' | 'rented' | 'unavailable') => {
      const statusId = findStatusId(newStatus);
      if (!statusId) throw new Error('Nie udało się pobrać statusów');
      return updateRentalStatus(rental.id, statusId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  const clientName = rental.client
    ? `${rental.client.firstName} ${rental.client.lastName}`
    : `Klient #${rental.clientId}`;

  return (
    <View className="bg-card rounded-xl border border-border p-4 gap-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-accent items-center justify-center">
            <MaterialIcons name="person" size={18} color={T['accent-foreground']} />
          </View>
          <Text className="text-foreground font-semibold text-sm">{clientName}</Text>
        </View>
        <Badge className="border border-border rounded-full px-2.5 py-1 flex-row items-center gap-1">
          <MaterialIcons name={cfg.icon} size={12} color={cfg.color} />
          <Text className="text-foreground text-xs font-semibold">{cfg.label}</Text>
        </Badge>
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

      {isPending ? (
        <View className="flex-row gap-2">
          <Button
            className="flex-1 rounded-xl"
            size="sm"
            onPress={() => mutation.mutate('rented')}
            disabled={mutation.isPending}
          >
            <MaterialIcons name="check" size={16} color="#fff" />
            <Text className="text-primary-foreground font-semibold ml-1">Potwierdź</Text>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onPress={() => mutation.mutate('available')}
            disabled={mutation.isPending}
            className="flex-1 rounded-xl"
          >
            <MaterialIcons name="close" size={16} color="#fff" />
            <Text className="text-destructive-foreground font-semibold ml-1">Odrzuć</Text>
          </Button>
        </View>
      ) : isRented ? (
        <Button
          variant="outline"
          size="sm"
          onPress={() => mutation.mutate('available')}
          disabled={mutation.isPending}
          className="rounded-xl"
        >
          <MaterialIcons name="history" size={16} color={T.foreground} />
          <Text className="text-foreground font-semibold ml-1">Oznacz jako zwrócone</Text>
        </Button>
      ) : null}
    </View>
  );
}
