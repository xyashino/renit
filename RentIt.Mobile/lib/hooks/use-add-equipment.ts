import { useAuth } from '@/context/auth';
import { CATEGORIES, findStatusId } from '@/lib/constants/lookups';
import { equipmentSchema, type EquipmentFormData } from '@/lib/schemas/equipment';
import { createEquipment } from '@/services/equipment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useAddEquipment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      price: '',
      deposit: '0',
      address: '',
      categoryId: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      if (!user) throw new Error('Nie jesteś zalogowany');

      const availableId = findStatusId('available');
      if (!availableId) throw new Error('Nie udało się pobrać statusów');

      return createEquipment({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        imageUrl: data.imageUrl.trim() || undefined,
        pricePerDay: Number(data.price),
        deposit: Number(data.deposit) || 0,
        address: data.address.trim(),
        userId: user.userId,
        categoryId: data.categoryId,
        statusId: availableId,
      });
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
    categories: CATEGORIES,
    isPending: mutation.isPending,
    submit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
