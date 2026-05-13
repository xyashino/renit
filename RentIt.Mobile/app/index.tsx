import { useAuthSessionState } from '@/src/shared/auth/session';
import { StartupSplashScreen } from '@/src/shared/ui';
import { Redirect } from 'expo-router';

export default function Index() {
  const { token, isLoading } = useAuthSessionState();
  if (isLoading) {
    return <StartupSplashScreen />;
  }
  if (token) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/(auth)/sign-in" />;
}
