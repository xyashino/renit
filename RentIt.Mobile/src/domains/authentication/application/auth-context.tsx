import { createContext, useContext, type ReactNode } from 'react';
import type { AuthUser } from '@authentication/domain/session';

import { useAuthActions, type SignUpPayload } from './hooks/use-auth-actions';
import { useAuthSession } from './hooks/use-auth-session';

export type { AuthUser } from '@authentication/domain/session';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const sessionQuery = useAuthSession();
  const { login, signUp, logout } = useAuthActions();

  const session = sessionQuery.data ?? null;
  const isLoading = sessionQuery.isLoading;

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isLoading,
        login,
        signUp,
        logout,
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
