import { useCurrentUser } from '@/src/shared/auth/session';
import { createRental } from '@/src/shared/api/rentals';
import { getEquipmentPricing } from '@/src/shared/api/equipment';
import { daysBetween, findStatusId, parseDate } from '@/src/shared/domain';
import { newRentalSchema, type NewRentalFormData } from '../schemas/rental';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

function toYmd(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

export function useNewRental() {
  const { equipmentId, id } = useLocalSearchParams<{ equipmentId?: string; id?: string }>();
  const router = useRouter();
  const user = useCurrentUser();
  const targetEquipmentId = Number(equipmentId ?? id);

  const { data: equipment, isLoading: equipLoading } = useQuery({
    queryKey: ['equipment', targetEquipmentId, 'pricing'],
    queryFn: () => getEquipmentPricing(targetEquipmentId),
    enabled: !isNaN(targetEquipmentId),
  });

  const form = useForm<NewRentalFormData>({
    resolver: zodResolver(newRentalSchema),
    defaultValues: { dateFrom: '', durationDays: 1, address: '', notes: '' },
  });

  const dateFrom = form.watch('dateFrom');
  const durationDays = form.watch('durationDays');
  const fromDate = parseDate(dateFrom);
  const toDate = fromDate ? new Date(fromDate) : null;
  if (toDate) {
    toDate.setUTCDate(toDate.getUTCDate() + durationDays);
  }
  const days = fromDate && toDate ? daysBetween(fromDate, toDate) : null;
  const totalPrice = days && equipment ? days * equipment.pricePerDay : null;

  const mutation = useMutation({
    mutationFn: async (payload: NewRentalFormData) => {
      const data = newRentalSchema.parse(payload);

      if (!user) throw new Error('Nie jesteś zalogowany');

      const from = parseDate(data.dateFrom);
      const to = from ? new Date(from) : null;
      if (to) {
        to.setUTCDate(to.getUTCDate() + data.durationDays);
      }
      if (!from) throw new Error('Podaj prawidłową datę od (RRRR-MM-DD)');
      if (!to) throw new Error('Podaj prawidłową datę odbioru');
      if (to <= from) throw new Error('Data zakończenia musi być po dacie rozpoczęcia');

      const unavailableId = findStatusId('unavailable');
      if (!unavailableId) throw new Error('Nie udało się pobrać statusów');

      return createRental({
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        notes: data.notes.trim(),
        address: data.address.trim(),
        clientId: user.userId,
        equipmentId: targetEquipmentId,
        statusId: unavailableId,
      });
    },
    onSuccess: (rental) => {
      router.replace({ pathname: '/rental/confirmed', params: { rentalId: String(rental.id) } });
    },
    onError: (e) => {
      Alert.alert('Błąd', e instanceof Error ? e.message : 'Spróbuj ponownie');
    },
  });

  return {
    form,
    equipment,
    equipLoading,
    dateTo: toDate ? toYmd(toDate) : null,
    days,
    totalPrice,
    isPending: mutation.isPending,
    submit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
