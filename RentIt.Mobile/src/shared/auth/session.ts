import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, createElement, useCallback, useContext, type ReactNode } from 'react';

export const AUTH_SESSION_STORAGE_KEY = 'rentit_auth';
export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export type AuthUser = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type AuthSessionInput = AuthSession | ({ token: string } & AuthUser);

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setSession: (session: AuthSessionInput) => Promise<AuthSession>;
  clearSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeSession(input: AuthSessionInput): AuthSession {
  if ('user' in input) return input;
  const { token, ...user } = input;
  return { token, user };
}

export async function readStoredSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

export async function readStoredAuthToken(): Promise<string | null> {
  const session = await readStoredSession();
  return session?.token ?? null;
}

export async function writeStoredSession(input: AuthSessionInput): Promise<AuthSession> {
  const session = normalizeSession(input);
  await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function clearStoredSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: readStoredSession,
    staleTime: Infinity,
  });

  const setSession = useCallback(
    async (input: AuthSessionInput) => {
      const session = await writeStoredSession(input);
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
      return session;
    },
    [queryClient],
  );

  const clearSession = useCallback(async () => {
    await clearStoredSession();
    queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
  }, [queryClient]);

  const session = sessionQuery.data ?? null;

  return createElement(
    AuthContext.Provider,
    {
      value: {
        user: session?.user ?? null,
        token: session?.token ?? null,
        isLoading: sessionQuery.isLoading,
        setSession,
        clearSession,
      },
    },
    children,
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function useAuthSessionState() {
  const { user, token, isLoading } = useAuth();
  return { user, token, isLoading };
}

export function useCurrentUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

export function useCurrentUserId(): number | null {
  const { user } = useAuth();
  return user?.userId ?? null;
}

export function useIsAuthenticated(): boolean {
  const { token } = useAuth();
  return Boolean(token);
}

export function useLogout(): { logout: () => Promise<void> } {
  const { clearSession } = useAuth();
  return {
    logout: async () => {
      await clearSession();
    },
  };
}
