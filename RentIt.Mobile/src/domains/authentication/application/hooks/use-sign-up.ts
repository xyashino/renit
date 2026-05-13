import { useAuthActions } from './use-auth-actions';
import { signUpSchema, type SignUpFormData } from '../schemas/auth';
import { MESSAGES, ROUTES } from '../../constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useSignUp() {
  const router = useRouter();
  const { signUpMutation } = useAuthActions();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(({ confirmPassword: _omit, ...payload }) => {
    signUpMutation.mutate(payload, {
      onSuccess: () => router.replace(ROUTES.POST_AUTH),
      onError: (error) =>
        Alert.alert(
          MESSAGES.ALERT_TITLE_SIGN_UP_ERROR,
          error instanceof Error ? error.message : MESSAGES.GENERIC_RETRY,
        ),
    });
  });

  return { form, onSubmit, isPending: signUpMutation.isPending };
}
