import { findRentalStatusId, type RentalStatusKey } from '../../domain';
import { updateRentalStatus } from '../../infrastructure/commands';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

export function useOwnerRentalStatus(rentalId: number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStatus: RentalStatusKey) => {
      const statusId = findRentalStatusId(newStatus);
      if (statusId == null) throw new Error('Nie udało się pobrać statusów');
      return updateRentalStatus(rentalId, statusId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['rental', rentalId] });
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  return { updateStatus: mutation.mutate, isPending: mutation.isPending };
}
