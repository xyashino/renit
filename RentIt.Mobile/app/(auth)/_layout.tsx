import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/src/shared/constants/theme';

export default function AuthLayout() {
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: THEME[scheme].background },
      }}
    />
  );
}
