import { getEquipmentBlockedRanges } from '@/src/domains/availability';
import { useAuth } from '@/src/shared/auth';
import { daysBetween, parseDate, startOfToday } from '../../domain/dates';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { RENTAL_BOOKING_HORIZON_DAYS, rentalConfirmedHref } from '../../constants';
import { computeAvailableSlots } from '../../domain/availability';
import { rentalPeriodFromDuration } from '../../domain/rental-period';
import { createRental } from '../../infrastructure/commands';
import { newRentalSchema, type NewRentalFormData } from '../schemas/forms';
import { useRentalBookingSlots } from './use-rental-booking-slots';

type UseNewRentalOptions = {
  equipmentId: number;
  pricePerDay: number;
  pickupAddress?: string;
};

export function useNewRental({ equipmentId, pricePerDay, pickupAddress }: UseNewRentalOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const pickupAddressNormalized = (pickupAddress ?? '').trim();

  const form = useForm<NewRentalFormData>({
    resolver: zodResolver(newRentalSchema),
    defaultValues: { dateFrom: '', durationDays: 3, notes: '' },
  });

  const dateFrom = form.watch('dateFrom');
  const durationDays = form.watch('durationDays');

  const { availableSlots, searchFromYmd, searchToYmd, slotsLoading, slotsError } =
    useRentalBookingSlots(equipmentId, durationDays, dateFrom, form);

  const period = useMemo(
    () => (dateFrom ? rentalPeriodFromDuration(dateFrom, durationDays) : null),
    [dateFrom, durationDays]
  );

  const days =
    period && parseDate(dateFrom)
      ? daysBetween(parseDate(dateFrom)!, period.dateToIso)
      : null;
  const totalPrice = days != null ? days * pricePerDay : null;

  const canSubmit =
    !!user &&
    !!pickupAddressNormalized &&
    !!period &&
    availableSlots.some((slot) => slot.dateFrom === dateFrom) &&
    !slotsLoading &&
    !slotsError;

  const mutation = useMutation({
    mutationFn: async (payload: NewRentalFormData) => {
      if (!user) throw new Error('Nie jesteś zalogowany');
      if (!pickupAddressNormalized) throw new Error('Brak adresu odbioru u właściciela');

      const data = newRentalSchema.parse(payload);
      const rentalPeriod = rentalPeriodFromDuration(data.dateFrom, data.durationDays);
      if (!rentalPeriod) throw new Error('Wybierz prawidłowy termin');

      const blocked = await getEquipmentBlockedRanges(
        equipmentId,
        searchFromYmd,
        searchToYmd
      );
      const slots = computeAvailableSlots(blocked, data.durationDays, {
        horizonDays: RENTAL_BOOKING_HORIZON_DAYS,
        searchFrom: startOfToday(),
      });
      if (!slots.some((slot) => slot.dateFrom === data.dateFrom)) {
        throw new Error('Wybrany termin nie jest już dostępny');
      }

      return createRental({
        equipmentId,
        dateFrom: rentalPeriod.dateFromIso,
        dateTo: rentalPeriod.dateToIso,
        notes: (data.notes ?? '').trim(),
      });
    },
    onSuccess: (rental) => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', equipmentId, 'blocked'] });
      router.replace(rentalConfirmedHref(rental.id));
    },
    onError: (error) => {
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Spróbuj ponownie');
    },
  });

  return {
    form,
    period,
    days,
    totalPrice,
    availableSlots,
    slotsLoading,
    slotsError,
    canSubmit,
    isPending: mutation.isPending,
    submit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
