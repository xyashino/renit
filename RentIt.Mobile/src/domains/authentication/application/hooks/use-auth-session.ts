import { AUTH_SESSION_QUERY_KEY, readStoredSession } from '@/src/shared/auth/session';
import { useQuery } from '@tanstack/react-query';

export function useAuthSession() {
  return useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: readStoredSession,
    staleTime: Infinity,
  });
}
