import { useAuth } from '@/context/auth';
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function useSignUp() {
  const { register } = useAuth();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      password: '',
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit(register),
    isPending: form.formState.isSubmitting,
  };
}
