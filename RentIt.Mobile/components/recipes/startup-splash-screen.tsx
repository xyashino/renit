import { ActivityIndicator, View } from 'react-native';
import { Text } from '@/components/ui/text';

export function StartupSplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-4xl font-bold tracking-tight text-foreground">RentIt</Text>
      <Text className="mt-2 text-sm text-muted-foreground">Przygotowujemy Twoja sesje...</Text>
      <ActivityIndicator className="mt-8" />
    </View>
  );
}
