import { createAvailabilityBlock, deleteAvailabilityBlock } from '../../infrastructure/commands';
import type { EquipmentAvailabilityBlock } from '../../domain/availability-block';
import {
  availabilityBlockFormSchema,
  emptyAvailabilityBlockForm,
  type AvailabilityBlockFormData,
} from '../schemas/forms';
import { toIsoDate } from '../utils/dates';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useAvailabilityBlockForm(equipmentId: number, blocksQueryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AvailabilityBlockFormData>(emptyAvailabilityBlockForm);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsed = availabilityBlockFormSchema.parse(form);
      await createAvailabilityBlock({
        equipmentId,
        dateFrom: toIsoDate(parsed.dateFrom),
        dateTo: toIsoDate(parsed.dateTo),
        reason: parsed.reason.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksQueryKey });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setForm(emptyAvailabilityBlockForm);
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
    setForm,
    saveMutation,
    confirmDelete,
  };
}
