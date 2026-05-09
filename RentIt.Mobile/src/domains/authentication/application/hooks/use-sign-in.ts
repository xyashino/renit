import { useAuth } from '@authentication/application/auth-context';
import { signInSchema, type SignInFormData } from '@authentication/application/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type UseSignInOptions = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useSignIn({ onSuccess, onError }: UseSignInOptions = {}) {
  const { login } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);
    try {
      await login(data.email, data.password);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Sprobuj ponownie');
    } finally {
      setIsPending(false);
    }
  });

  return { form, onSubmit, isPending };
}
