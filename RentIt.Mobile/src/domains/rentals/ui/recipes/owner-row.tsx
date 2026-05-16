import { rentalDetailHref } from '../../constants';
import { findRentalStatusId, type Rental, type RentalStatusKey } from '../../domain';
import { updateRentalStatus } from '../../infrastructure';
import { Row } from '../components/row';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

type Props = {
  rental: Rental;
};

export function OwnerRow({ rental }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const statusName: RentalStatusKey = rental.status?.key ?? 'pending';
  const isPending = statusName === 'pending';
  const isActive = statusName === 'active';

  const mutation = useMutation({
    mutationFn: (newStatus: RentalStatusKey) => {
      const statusId = findRentalStatusId(newStatus);
      if (statusId == null) throw new Error('Nie udało się pobrać statusów');
      return updateRentalStatus(rental.id, statusId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['rental', rental.id] });
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  const clientName = rental.client
    ? `${rental.client.firstName} ${rental.client.lastName}`
    : `Klient #${rental.clientId}`;

  return (
    <Row
      rental={rental}
      clientName={clientName}
      status={statusName}
      onPress={() => router.push(rentalDetailHref(rental.id, true))}
      showPendingActions={isPending}
      showCompleteAction={isActive}
      onConfirm={() => mutation.mutate('active')}
      onReject={() => mutation.mutate('cancelled')}
      onComplete={() => mutation.mutate('completed')}
      actionsDisabled={mutation.isPending}
    />
  );
}
