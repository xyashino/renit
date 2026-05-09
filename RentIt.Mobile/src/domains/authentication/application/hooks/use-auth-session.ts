import { useQuery } from '@tanstack/react-query';

import { readStoredSession } from '@authentication/infrastructure/session-storage';

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export function useAuthSession() {
  return useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: readStoredSession,
    staleTime: Infinity,
  });
}
