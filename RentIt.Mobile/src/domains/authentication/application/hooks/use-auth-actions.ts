import { useAuth } from '@/src/shared/auth/session';
import { loginApi, registerApi, type RegisterPayload } from '../../infrastructure/auth-api';
import { useMutation } from '@tanstack/react-query';

export type SignUpPayload = Omit<RegisterPayload, 'address'>;

export function useAuthActions() {
  const { setSession, clearSession } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await loginApi(email, password);
      return setSession(response);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpPayload) => {
      const response = await registerApi(data);
      return setSession(response);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: clearSession,
  });

  return { loginMutation, signUpMutation, logoutMutation };
}
