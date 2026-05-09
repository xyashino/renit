import { useCurrentUser } from '@/src/shared/auth/session';
import { profileSchema, type ProfileFormData } from '@/lib/schemas/auth';
import { getUser, updateUser } from '@/services/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useProfileForm() {
  const user = useCurrentUser();
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
      address: profile?.address ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!user) throw new Error('Nie jesteś zalogowany');
      await updateUser(user.userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.userId] });
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
