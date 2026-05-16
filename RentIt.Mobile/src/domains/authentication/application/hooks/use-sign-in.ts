import { POST_AUTH_ROUTES } from '@/src/shared/auth';
import { useAuth } from '@/src/shared/auth';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { login } from '../../infrastructure/commands';
import { signInSchema, type SignInFormData } from '../schemas/forms';

export function useSignIn() {
  const router = useRouter();
  const { setSession } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await login(email, password);
      return setSession(response);
    },
  });

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (session) => {
          router.replace(POST_AUTH_ROUTES[session.user.accountType]);
        },
        onError: (error) =>
          Alert.alert(
            'Blad logowania',
            error instanceof Error ? error.message : 'Sprobuj ponownie',
          ),
      },
    );
  });

  return { form, onSubmit, isPending: loginMutation.isPending };
}
