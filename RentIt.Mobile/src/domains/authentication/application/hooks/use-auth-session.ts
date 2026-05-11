import { AUTH_SESSION_QUERY_KEY } from '@authentication/constants';
import { readStoredSession } from '@authentication/infrastructure/session-storage';
import { useQuery } from '@tanstack/react-query';

export function useAuthSession() {
  return useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: readStoredSession,
    staleTime: Infinity,
  });
}
