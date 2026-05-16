import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createElement, useCallback, type ReactNode } from 'react';
import { AUTH_USER_QUERY_KEY } from '../../constants';
import { fetchAuthSession } from '../../infrastructure/queries';
import { authSessionFromPayload } from '../../infrastructure/session';
import { clearAuthToken, writeAuthToken } from '../../infrastructure/session-storage';
import { AuthContext } from '../context/auth-context';
import type { ApiSessionPayload } from '../../domain/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: fetchAuthSession,
    staleTime: 60_000,
    retry: false,
  });

  const setSession = useCallback(
    async (input: ApiSessionPayload) => {
      await writeAuthToken(input.token);
      const session = authSessionFromPayload(input);
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, session);
      return session;
    },
    [queryClient],
  );

  const clearSession = useCallback(async () => {
    await clearAuthToken();
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== AUTH_USER_QUERY_KEY[0],
    });
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
