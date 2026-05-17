import { createAvailabilityBlock, deleteAvailabilityBlock } from '../../infrastructure/commands';
import type { EquipmentAvailabilityBlock } from '../../domain/availability-block';
import {
  availabilityBlockFormSchema,
  emptyAvailabilityBlockForm,
  type AvailabilityBlockFormData,
} from '../schemas/forms';
import { toIsoDate } from '../utils/dates';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

export function useAvailabilityBlockForm(equipmentId: number, blocksQueryKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  const form = useForm<AvailabilityBlockFormData>({
    resolver: zodResolver(availabilityBlockFormSchema),
    defaultValues: emptyAvailabilityBlockForm,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: AvailabilityBlockFormData) => {
      await createAvailabilityBlock({
        equipmentId,
        dateFrom: toIsoDate(data.dateFrom),
        dateTo: toIsoDate(data.dateTo),
        reason: data.reason.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksQueryKey });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      form.reset(emptyAvailabilityBlockForm);
    },
    onError: (error) => {
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Spróbuj ponownie');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAvailabilityBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksQueryKey });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Spróbuj ponownie');
    },
  });

  function confirmDelete(block: EquipmentAvailabilityBlock) {
    Alert.alert('Usuń blokadę', 'Czy na pewno usunąć tę blokadę dostępności?', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Usuń', style: 'destructive', onPress: () => deleteMutation.mutate(block.id) },
    ]);
  }

  return {
    form,
    submit: form.handleSubmit((data) => saveMutation.mutate(data)),
    saveMutation,
    confirmDelete,
  };
}
