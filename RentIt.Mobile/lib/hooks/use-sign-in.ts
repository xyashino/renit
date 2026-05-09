import { useAuth } from '@/context/auth';
import { signInSchema, type SignInFormData } from '@/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useSignIn() {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: SignInFormData) => login(data.email, data.password),
    onSuccess: () => {
      router.replace('/(tabs)');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Spróbuj ponownie';
      Alert.alert('Błąd logowania', message);
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
  };
}
