import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createElement, useCallback, type ReactNode } from 'react';
import { AUTH_SESSION_QUERY_KEY } from '../../constants';
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from '../../infrastructure/session-storage';
import { AuthContext } from '../context/auth-context';
import type { ApiSessionPayload } from '../../domain/types';

function isAuthSessionQuery(queryKey: readonly unknown[]): boolean {
  return queryKey[0] === AUTH_SESSION_QUERY_KEY[0];
}

function clearUserQueryCache(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.removeQueries({
    predicate: (query) => !isAuthSessionQuery(query.queryKey),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: readStoredSession,
    staleTime: Infinity,
  });

  const setSession = useCallback(
    async (input: ApiSessionPayload) => {
      const session = await writeStoredSession(input);
      clearUserQueryCache(queryClient);
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
      return session;
    },
    [queryClient],
  );

  const clearSession = useCallback(async () => {
    await clearStoredSession();
    queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
    clearUserQueryCache(queryClient);
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
