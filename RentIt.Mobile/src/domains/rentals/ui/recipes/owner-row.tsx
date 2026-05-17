import { useOwnerRentalStatus } from '../../application/hooks/use-owner-rental-status';
import { rentalDetailHref } from '../../constants';
import type { Rental, RentalStatusKey } from '../../domain';
import { Row } from '../components/row';
import { useRouter } from 'expo-router';

type Props = {
  rental: Rental;
};

export function OwnerRow({ rental }: Props) {
  const router = useRouter();
  const { updateStatus, isPending } = useOwnerRentalStatus(rental.id);
  const statusName: RentalStatusKey = rental.status?.key ?? 'pending';
  const isPendingStatus = statusName === 'pending';
  const isActive = statusName === 'active';

  const clientName = rental.client
    ? `${rental.client.firstName} ${rental.client.lastName}`
    : `Klient #${rental.clientId}`;

  return (
    <Row
      rental={rental}
      clientName={clientName}
      status={statusName}
      onPress={() => router.push(rentalDetailHref(rental.id, true))}
      showPendingActions={isPendingStatus}
      showCompleteAction={isActive}
      onConfirm={() => updateStatus('active')}
      onReject={() => updateStatus('cancelled')}
      onComplete={() => updateStatus('completed')}
      actionsDisabled={isPending}
    />
  );
}
