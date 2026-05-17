import { AUTH_USER_QUERY_KEY, ROUTES, useAuth } from '@/src/shared/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { updateUser } from '../../infrastructure/commands';
import { getUser } from '../../infrastructure/queries';
import { profileSchema, type ProfileFormData } from '../schemas/forms';

export function useProfile() {
  const router = useRouter();
  const { user, clearSession } = useAuth();
  const queryClient = useQueryClient();
  const accountType = user?.accountType ?? null;

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

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!user) throw new Error('Nie jestes zalogowany');
      await updateUser(user.userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.userId] });
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
      Alert.alert('Sukces', 'Profil zaktualizowany.');
    },
    onError: (error) =>
      Alert.alert(
        'Blad zapisu',
        error instanceof Error ? error.message : 'Sprobuj ponownie',
      ),
  });

  const onSubmit = form.handleSubmit((data) => updateMutation.mutate(data));

  async function onLogout() {
    await clearSession();
    router.replace(ROUTES.SIGN_IN);
    Alert.alert('Wylogowano');
  }

  return {
    form,
    onSubmit,
    isPending: updateMutation.isPending,
    accountType,
    onLogout,
  };
}
