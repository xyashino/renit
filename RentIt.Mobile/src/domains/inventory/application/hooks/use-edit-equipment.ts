import { updateEquipment } from '../../infrastructure/commands';
import { equipmentToFormData, toEquipmentWritePayload } from '../mappers/equipment-form';
import { equipmentSchema, type EquipmentFormData } from '../schemas/forms';
import { useCategories } from './use-categories';
import { useEquipmentById } from './use-equipment-by-id';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useEditEquipment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const equipmentId = Number(id);
  const { equipment } = useEquipmentById(equipmentId);
  const { categories } = useCategories();

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    values: equipmentToFormData(equipment),
  });

  const mutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      return updateEquipment(equipmentId, toEquipmentWritePayload(data, equipment.statusId));
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

  return {
    form,
    categories,
    isPending: mutation.isPending,
    submit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
