import { AUTH_SESSION_QUERY_KEY } from '@authentication/constants';
import { loginApi, registerApi, type RegisterPayload } from '@authentication/infrastructure/auth-api';
import { clearStoredSession, writeStoredSession } from '@authentication/infrastructure/session-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type SignUpPayload = Omit<RegisterPayload, 'address'>;

export function useAuthActions() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await loginApi(email, password);
      return writeStoredSession(response);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpPayload) => {
      const response = await registerApi(data);
      return writeStoredSession(response);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await clearStoredSession();
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
    },
  });

  return { loginMutation, signUpMutation, logoutMutation };
}
