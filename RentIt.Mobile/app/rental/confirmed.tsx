import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEME } from '@/constants/theme';
import { StartupSplashScreen } from '@/components/recipes/startup-splash-screen';
import { useColorScheme } from 'nativewind';
import { Suspense } from 'react';

export default function RentalConfirmedScreen() {
  return (
    <Suspense fallback={<StartupSplashScreen />}>
      <RentalConfirmedScreenContent />
    </Suspense>
  );
}

function RentalConfirmedScreenContent() {
  const { rentalId } = useLocalSearchParams<{ rentalId: string }>();
  const router = useRouter();
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[scheme];

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <View className="bg-accent rounded-full w-24 h-24 items-center justify-center mb-6">
        <MaterialIcons name="check-circle" size={56} color={colors.primary} />
      </View>

      <Text className="text-foreground text-2xl font-bold text-center mb-3">
        Rezerwacja złożona!
      </Text>
      <Text className="text-muted-foreground text-base text-center mb-2">
        Twoja prośba o wypożyczenie została wysłana do właściciela.
      </Text>
      <Text className="text-muted-foreground text-sm text-center mb-8">
        Rezerwacja #{rentalId} — oczekuje na potwierdzenie.
      </Text>

      <View className="w-full gap-3">
        <Button
          className="w-full h-12 rounded-xl"
          onPress={() => router.replace('/(tabs)/rentals')}
        >
          <MaterialIcons name="assignment" size={18} color="#fff" />
          <Text className="text-primary-foreground font-semibold ml-2">Moje wypożyczenia</Text>
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-foreground font-semibold">Powrót do przeglądania</Text>
        </Button>
      </View>
    </View>
  );
}
