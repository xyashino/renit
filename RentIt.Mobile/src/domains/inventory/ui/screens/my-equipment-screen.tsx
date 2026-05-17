import { EmptyStateRecipe } from '@/src/shared/ui/recipes/empty-state';
import { ScreenHeader } from '@/src/shared/ui/recipes/screen-header';
import { useMyEquipment } from '../../application/hooks/use-my-equipment';
import {
  equipmentAddHref,
  equipmentRentalBlockHref,
  equipmentEditHref,
  equipmentRentalsHref,
} from '../../constants';
import { router } from 'expo-router';
import { Suspense } from 'react';
import { ScrollView, View } from 'react-native';
import { ListCard } from '../components/list-card';
import { StartupSplashScreen } from '@/src/shared/ui/screens/startup-splash-screen';

export function MyEquipmentScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <MyEquipmentScreenContent />
    </Suspense>
  );
}

function MyEquipmentScreenContent() {
  const { myEquipment, confirmDelete } = useMyEquipment();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Mój sprzęt"
          description="Zarządzaj swoimi ogłoszeniami."
          actionLabel="Dodaj"
          onActionPress={() => router.push(equipmentAddHref())}
        />

        {myEquipment.length === 0 ? (
          <EmptyStateRecipe
            title="Brak sprzętu"
            description="Dodaj swój pierwszy sprzęt, aby zacząć zarabiać."
          />
        ) : (
          <View className="w-full gap-5">
            {myEquipment.map((item) => (
              <ListCard
                key={item.id}
                item={item}
                onEdit={() => router.push(equipmentEditHref(item.id))}
                onViewRentals={() => router.push(equipmentRentalsHref(item.id))}
                onManageAvailability={() => router.push(equipmentRentalBlockHref(item.id))}
                onDelete={() => confirmDelete(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
