import { OwnerRow } from '@/src/domains/rentals';
import { EmptyStateRecipe } from '@/src/shared/ui/recipes/empty-state';
import { ErrorAlertRecipe } from '@/src/shared/ui/recipes/error-alert';
import { ScreenHeader } from '@/src/shared/ui/recipes/screen-header';
import { StartupSplashScreen } from '@/src/shared/ui/screens/startup-splash-screen';
import { useEquipmentRentals } from '../../application/hooks/use-equipment-rentals';
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
  const { equipment, equipmentRentals, isError, refetch } = useEquipmentRentals();

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
