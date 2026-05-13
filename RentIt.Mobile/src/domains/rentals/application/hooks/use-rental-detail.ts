import { useCurrentUser } from '@/src/shared/auth/session';
import { findStatusId, daysBetween, type StatusKey } from '../../domain';
import { getRentalById, updateRentalStatus } from '../../infrastructure';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

export function useRentalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const rentalId = Number(id);

  const { data: rental, isError } = useSuspenseQuery({
    queryKey: ['rental', rentalId],
    queryFn: () => getRentalById(rentalId),
  });

  const statusMutation = useMutation({
    mutationFn: (statusKey: StatusKey) => {
      const statusId = findStatusId(statusKey);
      if (!statusId) throw new Error('Nie udało się pobrać statusów');
      return updateRentalStatus(rentalId, statusId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental', rentalId] });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  function confirmCancel() {
    Alert.alert('Anuluj rezerwację', 'Czy na pewno chcesz anulować tę rezerwację?', [
      { text: 'Nie', style: 'cancel' },
      { text: 'Anuluj rezerwację', style: 'destructive', onPress: () => statusMutation.mutate('available') },
    ]);
  }

  const days = rental ? daysBetween(rental.dateFrom, rental.dateTo) : 0;
  const totalPrice = days * (rental?.equipment?.pricePerDay ?? 0);
  const statusName: StatusKey = rental?.status?.key ?? 'unavailable';
  const isPending = statusName === 'unavailable';
  const isOwner = rental?.equipment?.userId === user?.userId;

  return {
    rental,
    isError,
    isPending,
    isOwner,
    days,
    totalPrice,
    statusName,
    statusMutation,
    confirmCancel,
    goBack: () => router.back(),
  };
}
