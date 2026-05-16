import { OwnerRow } from '@/src/domains/rentals';
import { getRentals } from '@/src/domains/rentals/infrastructure';
import { EmptyStateRecipe, ErrorAlertRecipe, ScreenHeader, StartupSplashScreen } from '@/src/shared/ui';
import { getEquipmentById } from '../../infrastructure/queries';
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

  const { data: equipmentRentals = [], isError, refetch } = useSuspenseQuery({
    queryKey: ['rentals', 'equipment', equipmentId],
    queryFn: () => getRentals(equipmentId),
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 80 }}
      >
        <ScreenHeader
          className="mb-6"
          title={equipment?.name ?? 'Rezerwacje sprzętu'}
          description={`${equipmentRentals.length} rezerwacji`}
          titleNumberOfLines={1}
        />

        {isError ? (
          <ErrorAlertRecipe
            title="Nie udalo sie zaladowac rezerwacji."
            description="Sprawdz polaczenie i sprobuj ponownie."
            onRetry={() => refetch()}
          />
        ) : equipmentRentals.length === 0 ? (
          <EmptyStateRecipe
            className="py-16"
            title="Brak rezerwacji"
            description="Nikt jeszcze nie zarezerwował tego sprzętu."
          />
        ) : (
          <View className="gap-4">
            {equipmentRentals.map((rental) => (
              <OwnerRow key={rental.id} rental={rental} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
