import { useAuth } from '@/src/shared/auth';
import { daysBetween, findRentalStatusId, type RentalStatusKey } from '../../domain';
import { getRentalById, updateRentalStatus } from '../../infrastructure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { confirmAction } from '@/src/shared/utils/confirm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

function parseRouteId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function useRentalDetail() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const rentalId = parseRouteId(id);

  const {
    data: rental,
    isError,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['rental', rentalId],
    queryFn: () => getRentalById(rentalId!),
    enabled: rentalId != null,
  });

  const statusMutation = useMutation({
    mutationFn: (statusKey: RentalStatusKey) => {
      if (rentalId == null) throw new Error('Nieprawidłowe wypożyczenie');
      const statusId = findRentalStatusId(statusKey);
      if (statusId == null) throw new Error('Nie udało się pobrać statusów');
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
      {
        text: 'Anuluj rezerwację',
        style: 'destructive',
        onPress: () => statusMutation.mutate('cancelled'),
      },
    ]);
  }

  const days = rental ? daysBetween(rental.dateFrom, rental.dateTo) : 0;
  const totalPrice = days * (rental?.equipment?.pricePerDay ?? 0);
  const statusName: RentalStatusKey = rental?.status?.key ?? 'pending';
  const isPendingStatus = statusName === 'pending';
  const isOwner = rental?.equipment?.userId === user?.userId;
  const isLoading = rentalId == null || isPending || isFetching;

  return {
    rental,
    isError: rentalId != null && isError,
    isLoading,
    isPending: isPendingStatus,
    isOwner,
    days,
    totalPrice,
    statusName,
    statusMutation,
    confirmCancel,
    refetch,
    goBack: () => router.back(),
  };
}
