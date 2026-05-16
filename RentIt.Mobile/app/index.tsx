import { POST_AUTH_ROUTES, ROUTES, useAuth } from '@/src/shared/auth';
import { StartupSplashScreen } from '@/src/shared/ui/screens/startup-splash-screen';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <StartupSplashScreen />;
  }
  if (user) {
    return <Redirect href={POST_AUTH_ROUTES[user.accountType]} />;
  }
  return <Redirect href={ROUTES.SIGN_IN} />;
}
