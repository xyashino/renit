import { useAuthActions } from './use-auth-actions';
import { signInSchema, type SignInFormData } from '../schemas/auth';
import { MESSAGES, ROUTES } from '../../constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useSignIn() {
  const router = useRouter();
  const { loginMutation } = useAuthActions();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => router.replace(ROUTES.POST_AUTH),
        onError: (error) =>
          Alert.alert(
            MESSAGES.ALERT_TITLE_SIGN_IN_ERROR,
            error instanceof Error ? error.message : MESSAGES.GENERIC_RETRY,
          ),
      },
    );
  });

  return { form, onSubmit, isPending: loginMutation.isPending };
}
