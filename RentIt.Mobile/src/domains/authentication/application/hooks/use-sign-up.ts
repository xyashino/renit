import { useAuth } from '@authentication/application/auth-context';
import { signUpSchema, type SignUpFormData } from '@authentication/application/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type UseSignUpOptions = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useSignUp({ onSuccess, onError }: UseSignUpOptions = {}) {
  const { signUp } = useAuth();
  const [isPending, setIsPending] = useState(false);

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

  const onSubmit = form.handleSubmit(async ({ confirmPassword: _omit, ...payload }) => {
    setIsPending(true);
    try {
      await signUp(payload);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Sprobuj ponownie');
    } finally {
      setIsPending(false);
    }
  });

  return { form, onSubmit, isPending };
}
