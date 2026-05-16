import { useAuthSessionState } from '@/src/shared/auth/session';
import { ROUTES } from '@/src/domains/authentication/constants';
import { getPostAuthRoute } from '@/src/domains/authentication/domain/account-type';
import { StartupSplashScreen } from '@/src/shared/ui';
import { Redirect } from 'expo-router';

export default function Index() {
  const { token, user, isLoading } = useAuthSessionState();
  if (isLoading) {
    return <StartupSplashScreen />;
  }
  if (token && user) {
    return <Redirect href={getPostAuthRoute(user.accountType)} />;
  }
  return <Redirect href={ROUTES.SIGN_IN} />;
}
