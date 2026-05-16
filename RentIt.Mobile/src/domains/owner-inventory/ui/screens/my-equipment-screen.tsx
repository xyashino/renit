import { EmptyStateRecipe, ScreenHeader, StartupSplashScreen } from '@/src/shared/ui';
import { useMyEquipment } from '../../application';
import {
  MY_EQUIPMENT_SCREEN,
  equipmentAddHref,
  equipmentAvailabilityHref,
  equipmentEditHref,
  equipmentRentalsHref,
} from '../../constants';
import { router } from 'expo-router';
import { Suspense } from 'react';
import { ScrollView, View } from 'react-native';
import { ListCard } from '../components/list-card';

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
          title={MY_EQUIPMENT_SCREEN.TITLE}
          description={MY_EQUIPMENT_SCREEN.DESCRIPTION}
          actionLabel={MY_EQUIPMENT_SCREEN.ACTION_LABEL}
          onActionPress={() => router.push(equipmentAddHref())}
        />

        {myEquipment.length === 0 ? (
          <EmptyStateRecipe
            title={MY_EQUIPMENT_SCREEN.EMPTY_TITLE}
            description={MY_EQUIPMENT_SCREEN.EMPTY_DESCRIPTION}
          />
        ) : (
          <View className="w-full gap-5">
            {myEquipment.map((item) => (
              <ListCard
                key={item.id}
                item={item}
                onEdit={() => router.push(equipmentEditHref(item.id))}
                onViewRentals={() => router.push(equipmentRentalsHref(item.id))}
                onManageAvailability={() => router.push(equipmentAvailabilityHref(item.id))}
                onDelete={() => confirmDelete(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
