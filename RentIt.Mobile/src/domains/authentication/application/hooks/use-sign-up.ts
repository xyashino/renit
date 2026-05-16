import { POST_AUTH_ROUTES } from '@/src/shared/auth/constants';
import { useAuth } from '@/src/shared/auth';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { registerApi } from '../../infrastructure/auth-api';
import type { RegisterPayload } from '../schemas/auth';
import { signUpSchema, type SignUpFormData } from '../schemas/forms';

export function useSignUp() {
  const router = useRouter();
  const { setSession } = useAuth();

  const signUpMutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await registerApi(data);
      return setSession(response);
    },
  });

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      accountType: undefined,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(({ confirmPassword: _omit, accountType, ...rest }) => {
    signUpMutation.mutate(
      { ...rest, accountType },
      {
        onSuccess: (session) => router.replace(POST_AUTH_ROUTES[session.user.accountType]),
        onError: (error) =>
          Alert.alert(
            'Blad rejestracji',
            error instanceof Error ? error.message : 'Sprobuj ponownie',
          ),
      },
    );
  });

  return { form, onSubmit, isPending: signUpMutation.isPending };
}
