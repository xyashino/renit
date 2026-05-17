import { THEME } from '@/src/shared/constants/theme';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function OwnerLayout() {
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[scheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.foreground,
          fontWeight: '700',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTintColor: colors.foreground,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="equipment/add" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="equipment/edit" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="equipment/rentals" options={{ headerShown: false }} />
      <Stack.Screen name="rental/block" options={{ headerShown: false }} />
      <Stack.Screen
        name="rental/[id]"
        options={{ title: 'Szczegóły rezerwacji', headerShown: true, headerBackTitle: 'Wróć' }}
      />
    </Stack>
  );
}
