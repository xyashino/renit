import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createElement, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { AUTH_USER_QUERY_KEY } from '../../constants';
import type { ApiSessionPayload, AuthSession, AuthUser } from '../../domain/types';
import { registerUnauthorizedHandler } from '../../infrastructure/auth-events';
import { authSessionFromPayload, fetchAuthUser } from '../../infrastructure/session';
import { AuthContext } from '../context/auth-context';
import { useStorageState } from '../hooks/use-storage-state';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [[isTokenLoading, token], setToken] = useStorageState();

  const userQuery = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: fetchAuthUser,
    enabled: !isTokenLoading && !!token,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!token || !userQuery.isFetched) return;
    if (userQuery.data) return;
    setToken(null);
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
  }, [token, userQuery.data, userQuery.isFetched, setToken, queryClient]);

  const clearSession = useCallback(async () => {
    setToken(null);
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== AUTH_USER_QUERY_KEY[0],
    });
  }, [queryClient, setToken]);

  useEffect(() => registerUnauthorizedHandler(clearSession), [clearSession]);

  const setSession = useCallback(
    async (input: ApiSessionPayload) => {
      const session = authSessionFromPayload(input);
      setToken(session.token);
      queryClient.setQueryData<AuthUser | null>(AUTH_USER_QUERY_KEY, session.user);
      return session;
    },
    [queryClient, setToken],
  );

  const user = token ? (userQuery.data ?? null) : null;
  const isLoading = isTokenLoading || (!!token && userQuery.isPending);

  const value = useMemo(
    () => ({
      user,
      token: token ?? null,
      isLoading,
      setSession,
      clearSession,
    }),
    [user, token, isLoading, setSession, clearSession],
  );

  return createElement(AuthContext.Provider, { value }, children);
}
