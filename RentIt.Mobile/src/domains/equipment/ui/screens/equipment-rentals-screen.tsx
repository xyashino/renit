import { Text } from '@/src/shared/ui/components/text';
import { getRentals } from '@/src/shared/api/rentals';
import { ErrorAlertRecipe, RentalRow, StartupSplashScreen } from '@/src/shared/ui';
import { getEquipmentById } from '../../infrastructure';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { ScrollView, View } from 'react-native';

export function EquipmentRentalsScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <EquipmentRentalsScreenContent />
    </Suspense>
  );
}

function EquipmentRentalsScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const equipmentId = Number(id);

  const { data: equipment } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  const { data: allRentals = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['rentals'],
    queryFn: getRentals,
  });

  const equipmentRentals = allRentals.filter((r) => r.equipmentId === equipmentId);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 80 }}
      >
        <View className="mb-6 gap-1">
          <Text className="text-foreground font-bold text-lg" numberOfLines={1}>
            {equipment?.name ?? 'Rezerwacje sprzętu'}
          </Text>
          <Text className="text-muted-foreground text-sm">{equipmentRentals.length} rezerwacji</Text>
        </View>

        {isError ? (
          <ErrorAlertRecipe
            title="Nie udalo sie zaladowac rezerwacji."
            description="Sprawdz polaczenie i sprobuj ponownie."
            onRetry={() => refetch()}
          />
        ) : equipmentRentals.length === 0 ? (
          <View className="items-center py-16 gap-3">
            <Text className="text-foreground font-semibold text-base">Brak rezerwacji</Text>
            <Text className="text-muted-foreground text-sm text-center">
              Nikt jeszcze nie zarezerwował tego sprzętu.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {equipmentRentals.map((rental) => (
              <RentalRow key={rental.id} rental={rental} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
