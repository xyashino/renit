import { StartupSplashScreen } from '@/src/shared/ui';
import { AvailabilityBlocksPanel } from '../recipes/availability-blocks-panel';
import { useLocalSearchParams } from 'expo-router';
import { Suspense } from 'react';
import { View } from 'react-native';

export function AvailabilityBlocksScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <AvailabilityBlocksScreenContent />
    </Suspense>
  );
}

function AvailabilityBlocksScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const equipmentId = Number(id);

  return (
    <View className="flex-1 bg-background">
      <AvailabilityBlocksPanel equipmentId={equipmentId} />
    </View>
  );
}
