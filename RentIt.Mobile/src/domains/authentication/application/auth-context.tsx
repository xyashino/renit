import { createContext, useContext, type ReactNode } from 'react';
import type { AuthUser } from '@authentication/domain/session';

import { useAuthActions } from './hooks/use-auth-actions';
import { useAuthSession } from './hooks/use-auth-session';

export type { AuthUser } from '@authentication/domain/session';

type AuthActions = ReturnType<typeof useAuthActions>;

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
} & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const sessionQuery = useAuthSession();
  const mutations = useAuthActions();

  const session = sessionQuery.data ?? null;
  const isLoading = sessionQuery.isLoading;

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isLoading,
        ...mutations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
