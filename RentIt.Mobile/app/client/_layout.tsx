import { THEME } from '@/src/shared/constants/theme';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function ClientLayout() {
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
      <Stack.Screen name="equipment/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="rental/[id]"
        options={{ title: 'Szczegóły rezerwacji', headerShown: true, headerBackTitle: 'Wróć' }}
      />
      <Stack.Screen name="rental/confirmed" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
