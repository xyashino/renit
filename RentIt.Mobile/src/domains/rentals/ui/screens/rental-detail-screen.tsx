import { Button } from '@/src/shared/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/components/card';
import { Separator } from '@/src/shared/ui/components/separator';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { formatDate } from '@/src/shared/utils/date';
import { ErrorAlertRecipe, StartupSplashScreen } from '@/src/shared/ui';
import { useRentalDetail } from '../../application';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Suspense } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type StatusColors = {
  primary: string;
  foreground: string;
  'muted-foreground': string;
  'accent-foreground': string;
};

function getStatusConfig(colors: StatusColors) {
  return {
    available: { label: 'Dostępny', color: colors.primary, icon: 'check-circle' },
    rented: { label: 'Aktywne', color: colors.primary, icon: 'check-circle' },
    unavailable: { label: 'Oczekujące', color: colors['muted-foreground'], icon: 'schedule' },
  } satisfies Record<string, { label: string; color: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }>;
}

export function RentalDetailScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <RentalDetailScreenContent />
    </Suspense>
  );
}

function RentalDetailScreenContent() {
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[scheme];
  const {
    rental,
    isError,
    isPending,
    isOwner,
    days,
    totalPrice,
    statusName,
    statusMutation,
    confirmCancel,
    goBack,
  } = useRentalDetail();

  const statusConfig = getStatusConfig(colors);
  const cfg = statusConfig[statusName] ?? statusConfig.unavailable;

  if (isError || !rental) {
    return (
      <View className="flex-1 bg-background justify-center px-6">
        <ErrorAlertRecipe
          title="Nie udalo sie zaladowac rezerwacji."
          description="Wystapil problem podczas pobierania danych."
          retryLabel="Wroc"
          onRetry={goBack}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 h-14 border-b border-border bg-card">
        <Pressable onPress={goBack} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-foreground font-bold text-lg">Szczegóły rezerwacji</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 bg-card rounded-xl border border-border p-4 mb-5">
          <MaterialIcons name={cfg.icon} size={32} color={cfg.color} />
          <View>
            <Text className="text-muted-foreground text-xs tracking-wide">Status</Text>
            <Text className="text-foreground font-bold text-lg">{cfg.label}</Text>
          </View>
        </View>

        <Card className="py-0 mb-5">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-foreground">Sprzęt</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="px-4 pt-4 pb-4">
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-xl bg-accent items-center justify-center">
                <MaterialIcons name="construction" size={28} color={colors['accent-foreground']} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base" numberOfLines={2}>
                  {rental.equipment?.name ?? `Sprzęt #${rental.equipmentId}`}
                </Text>
                {rental.address ? (
                  <View className="flex-row items-center gap-1 mt-1">
                    <MaterialIcons name="place" size={12} color={colors['muted-foreground']} />
                    <Text className="text-muted-foreground text-sm">{rental.address}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </CardContent>
        </Card>

        <Card className="py-0 mb-5">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-foreground">Termin i koszt</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="px-4 pt-4 pb-4 gap-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="calendar-today" size={18} color={colors['muted-foreground']} />
                <Text className="text-muted-foreground text-sm">Od</Text>
              </View>
              <Text className="text-foreground font-semibold">
                {formatDate(rental.dateFrom, { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="event" size={18} color={colors['muted-foreground']} />
                <Text className="text-muted-foreground text-sm">Do</Text>
              </View>
              <Text className="text-foreground font-semibold">
                {formatDate(rental.dateTo, { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <Separator />
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">
                {days} {days === 1 ? 'dzień' : 'dni'} × {rental.equipment?.pricePerDay ?? 0} zł
              </Text>
              <Text className="text-foreground text-sm">{totalPrice} zł</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-foreground font-bold">Razem</Text>
              <Text className="text-primary font-bold text-lg">{totalPrice} zł</Text>
            </View>
          </CardContent>
        </Card>

        {rental.notes ? (
          <Card className="py-0 mb-5">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-foreground">Notatka</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="px-4 pt-3 pb-4">
              <Text className="text-foreground">{rental.notes}</Text>
            </CardContent>
          </Card>
        ) : null}

        {isOwner && isPending ? (
          <Card className="py-0 mb-5">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-foreground">Akcje właściciela</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="px-4 pt-4 pb-4 gap-3">
              <Button
                onPress={() => statusMutation.mutate('rented')}
                disabled={statusMutation.isPending}
                className="rounded-xl"
              >
                <MaterialIcons name="check-circle" size={18} color="#fff" />
                <Text className="text-primary-foreground font-semibold ml-2">Potwierdź wypożyczenie</Text>
              </Button>
              <Button
                variant="outline"
                onPress={() => statusMutation.mutate('available')}
                disabled={statusMutation.isPending}
                className="rounded-xl"
              >
                <MaterialIcons name="history" size={18} color={colors.foreground} />
                <Text className="text-foreground font-semibold ml-2">Oznacz jako zakończone</Text>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!isOwner && isPending ? (
          <Button
            variant="destructive"
            onPress={confirmCancel}
            disabled={statusMutation.isPending}
            className="rounded-xl h-12"
          >
            <MaterialIcons name="cancel" size={18} color="#fff" />
            <Text className="text-destructive-foreground font-semibold ml-2">
              {statusMutation.isPending ? 'Anulowanie...' : 'Anuluj rezerwację'}
            </Text>
          </Button>
        ) : null}
      </ScrollView>
    </View>
  );
}
