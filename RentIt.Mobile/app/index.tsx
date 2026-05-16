import { POST_AUTH_ROUTES, ROUTES, useAuth } from '@/src/shared/auth';
import { StartupSplashScreen } from '@/src/shared/ui';
import { Redirect } from 'expo-router';

export default function Index() {
  const { token, user, isLoading } = useAuth();
  if (isLoading) {
    return <StartupSplashScreen />;
  }
  if (token && user) {
    return <Redirect href={POST_AUTH_ROUTES[user.accountType]} />;
  }
  return <Redirect href={ROUTES.SIGN_IN} />;
}
