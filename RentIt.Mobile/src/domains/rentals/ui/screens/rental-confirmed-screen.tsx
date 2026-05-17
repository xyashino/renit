import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { THEME } from '@/src/shared/constants/theme';
import { StartupSplashScreen } from '@/src/shared/ui/screens/startup-splash-screen';
import { RENTAL_CONFIRMED_SCREEN, ROUTES } from '../../constants';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Suspense } from 'react';
import { View } from 'react-native';

export function RentalConfirmedScreen() {
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
        {RENTAL_CONFIRMED_SCREEN.TITLE}
      </Text>
      <Text className="text-muted-foreground text-base text-center mb-2">
        {RENTAL_CONFIRMED_SCREEN.DESCRIPTION}
      </Text>
      <Text className="text-muted-foreground text-sm text-center mb-8">
        Rezerwacja #{rentalId} — oczekuje na potwierdzenie.
      </Text>

      <View className="w-full gap-3">
        <Button
          className="w-full h-12 rounded-xl"
          onPress={() => router.replace(ROUTES.CLIENT_RENTALS)}
        >
          <MaterialIcons name="assignment" size={18} color={colors['primary-foreground']} />
          <Text className="text-primary-foreground font-semibold ml-2">
            {RENTAL_CONFIRMED_SCREEN.RENTALS_BUTTON}
          </Text>
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl"
          onPress={() => router.replace(ROUTES.CLIENT_HOME)}
        >
          <Text className="text-foreground font-semibold">
            {RENTAL_CONFIRMED_SCREEN.BROWSE_BUTTON}
          </Text>
        </Button>
      </View>
    </View>
  );
}
