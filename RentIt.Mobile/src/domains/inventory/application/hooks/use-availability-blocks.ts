import {
  createAvailabilityBlock,
  deleteAvailabilityBlock,
  updateAvailabilityBlock,
} from '../../infrastructure/commands';
import {
  getAvailabilityBlocks,
  getEquipmentById,
} from '../../infrastructure/queries';
import type { EquipmentAvailabilityBlock } from '../../infrastructure/queries';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';

export type BlockFormState = {
  dateFrom: string;
  dateTo: string;
  reason: string;
};

export const emptyForm: BlockFormState = {
  dateFrom: '',
  dateTo: '',
  reason: '',
};

function toIsoDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export function toYmd(value: string): string {
  return value.split('T')[0] ?? '';
}

function parseYmd(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function useAvailabilityBlocks(equipmentId: number) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlockFormState>(emptyForm);

  const { data: equipment } = useSuspenseQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });

  const blocksQueryKey = ['availability-blocks', equipmentId];
  const { data: blocks = [] } = useSuspenseQuery({
    queryKey: blocksQueryKey,
    queryFn: () => getAvailabilityBlocks(equipmentId),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.dateFrom || !form.dateTo) throw new Error('Wybierz zakres dat');
      if (parseYmd(form.dateFrom).getTime() >= parseYmd(form.dateTo).getTime()) {
        throw new Error('Data od musi być wcześniejsza niż data do');
      }

      const payload = {
        dateFrom: toIsoDate(form.dateFrom),
        dateTo: toIsoDate(form.dateTo),
        reason: form.reason.trim(),
      };

      if (editingId) {
        await updateAvailabilityBlock(editingId, payload);
        return;
      }

      await createAvailabilityBlock({ equipmentId, ...payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksQueryKey });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setEditingId(null);
      setForm(emptyForm);
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

  function editBlock(block: EquipmentAvailabilityBlock) {
    setEditingId(block.id);
    setForm({
      dateFrom: toYmd(block.dateFrom),
      dateTo: toYmd(block.dateTo),
      reason: block.reason ?? '',
    });
  }

  function confirmDelete(block: EquipmentAvailabilityBlock) {
    Alert.alert('Usuń blokadę', 'Czy na pewno usunąć tę blokadę dostępności?', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Usuń', style: 'destructive', onPress: () => deleteMutation.mutate(block.id) },
    ]);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return {
    equipment,
    blocks,
    editingId,
    form,
    setForm,
    saveMutation,
    editBlock,
    confirmDelete,
    cancelEdit,
  };
}
