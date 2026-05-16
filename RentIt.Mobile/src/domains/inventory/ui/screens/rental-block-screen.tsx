import { StartupSplashScreen } from '@/src/shared/ui';
import { AvailabilityBlocksPanel } from '../recipes/availability-blocks-panel';
import { useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { View } from 'react-native';

export function RentalBlockScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <RentalBlockScreenContent />
    </Suspense>
  );
}

function RentalBlockScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const equipmentId = Number(id);

  return (
    <View className="flex-1 bg-background">
      <AvailabilityBlocksPanel equipmentId={equipmentId} />
    </View>
  );
}
