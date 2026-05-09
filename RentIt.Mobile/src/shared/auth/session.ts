/**
 * Public facade for the authentication domain.
 * Other domains should import from here, not from @authentication/* directly.
 */
import {
  AuthProvider as DomainAuthProvider,
  useAuth as useDomainAuth,
  type AuthUser,
} from '@authentication/application/auth-context';

export type { AuthUser };
export const AuthProvider = DomainAuthProvider;

export function useAuthSessionState() {
  const { user, token, isLoading } = useDomainAuth();
  return { user, token, isLoading };
}

export function useCurrentUser(): AuthUser | null {
  const { user } = useDomainAuth();
  return user;
}

export function useCurrentUserId(): number | null {
  const { user } = useDomainAuth();
  return user?.userId ?? null;
}

export function useIsAuthenticated(): boolean {
  const { token } = useDomainAuth();
  return Boolean(token);
}

export function useLogout(): { logout: () => Promise<void> } {
  const { logout } = useDomainAuth();
  return { logout };
}
