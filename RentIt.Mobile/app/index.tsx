import { useAuth } from '@/context/auth';
import { StartupSplashScreen } from '@/components/recipes/startup-splash-screen';
import { Redirect } from 'expo-router';

export default function Index() {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return <StartupSplashScreen />;
  }
  if (token) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/(auth)/sign-in" />;
}
