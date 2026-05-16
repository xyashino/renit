import { createContext } from 'react';
import type { ApiSessionPayload, AuthSession } from '../../domain/types';

export type AuthContextValue = {
  user: AuthSession['user'] | null;
  token: string | null;
  isLoading: boolean;
  setSession: (session: ApiSessionPayload) => Promise<AuthSession>;
  clearSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
