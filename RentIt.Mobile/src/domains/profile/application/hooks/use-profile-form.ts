import { AUTH_USER_QUERY_KEY, useAuth } from '@/src/shared/auth';
import { profileSchema, type ProfileFormData } from '../schemas/profile';
import { updateUser } from '../../infrastructure/commands';
import { getUser } from '../../infrastructure/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useProfileForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['user', user?.userId],
    queryFn: () => getUser(user!.userId),
    enabled: !!user,
    staleTime: 60_000,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.firstName ?? user?.firstName ?? '',
      lastName: profile?.lastName ?? user?.lastName ?? '',
      email: profile?.email ?? user?.email ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!user) throw new Error('Nie jesteś zalogowany');
      if (!profile) throw new Error('Profil nie został załadowany');
      await updateUser(user.userId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        accountType: profile.accountType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.userId] });
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
      Alert.alert('Sukces', 'Profil zaktualizowany.');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Spróbuj ponownie';
      Alert.alert('Błąd zapisu', message);
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
  };
}
