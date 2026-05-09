import { CATEGORIES } from '@/lib/constants/lookups';
import { equipmentSchema, type EquipmentFormData } from '@/lib/schemas/equipment';
import { getEquipmentById, updateEquipment } from '@/services/equipment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useEditEquipment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const equipmentId = Number(id);

  const { data: equipment } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    values:{
      name: equipment?.name ?? '',
      description: equipment?.description ?? '',
      imageUrl: equipment?.imageUrl ?? '',
      price: String(equipment?.pricePerDay ?? 0),
      deposit: String(equipment?.deposit ?? 0),
      address: equipment?.address ?? '',
      categoryId: equipment?.categoryId ?? 0,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      if (!equipment) throw new Error('Brak danych sprzętu');

      return updateEquipment(equipmentId, {
        id: equipmentId,
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        imageUrl: data.imageUrl.trim() || undefined,
        pricePerDay: Number(data.price),
        deposit: Number(data.deposit) || 0,
        address: data.address.trim(),
        userId: equipment.userId,
        categoryId: data.categoryId,
        statusId: equipment.statusId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', equipmentId] });
      Alert.alert('Zapisano', 'Dane sprzętu zostały zaktualizowane.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  const categories = CATEGORIES;
  const categoryId = form.watch('categoryId');
  const currentCategory = categories.find((c) => c.id === categoryId);

  return {
    form,
    categories,
    currentCategory,
    isPending: mutation.isPending,
    submit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
