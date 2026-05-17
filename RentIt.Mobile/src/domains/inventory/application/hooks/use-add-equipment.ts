import { useAuth } from '@/src/shared/auth';
import { findStatusId } from '@/src/shared/domain';
import { createEquipment } from '../../infrastructure/commands';
import { toEquipmentWritePayload } from '../mappers/equipment-form';
import { equipmentSchema, type EquipmentFormData } from '../schemas/forms';
import { useCategories } from './use-categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useAddEquipment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { categories } = useCategories();

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      price: '',
      deposit: '0',
      address: '',
      categoryIds: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      if (!user) throw new Error('Nie jesteś zalogowany');

      const availableId = findStatusId('available');
      if (!availableId) throw new Error('Nie udało się pobrać statusów');

      return createEquipment(toEquipmentWritePayload(data, availableId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      Alert.alert('Sukces', 'Twój sprzęt został wystawiony!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  return {
    form,
    categories,
    isPending: mutation.isPending,
    submit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
