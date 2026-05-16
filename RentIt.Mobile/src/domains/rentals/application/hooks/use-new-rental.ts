import { getEquipmentBlockedRanges } from '@/src/domains/equipment-catalog/infrastructure';
import { useAuth } from '@/src/shared/auth';
import { daysBetween, parseDate } from '@/src/shared/domain';
import { Alert } from 'react-native';
import { toLocalYmd, startOfToday } from '@/src/shared/utils/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  RENTAL_BOOKING_HORIZON_DAYS,
  RENTAL_DURATION_OPTIONS,
  rentalConfirmedHref,
} from '../../constants';
import { computeAvailableSlots } from '../../domain/availability';
import { rentalPeriodFromDuration } from '../../domain/rental-period';
import { createRental } from '../../infrastructure';
import { newRentalSchema, type NewRentalFormData } from '../schemas/rental';

type UseNewRentalOptions = {
  equipmentId: number;
  pricePerDay: number;
  pickupAddress: string;
};

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function useNewRental({ equipmentId, pricePerDay, pickupAddress }: UseNewRentalOptions) {
  const router = useRouter();
  const { user } = useAuth();

  const searchFromYmd = useMemo(() => toLocalYmd(startOfToday()), []);
  const searchToYmd = useMemo(
    () => toLocalYmd(addDays(startOfToday(), RENTAL_BOOKING_HORIZON_DAYS)),
    []
  );

  const form = useForm<NewRentalFormData>({
    resolver: zodResolver(newRentalSchema),
    defaultValues: { dateFrom: '', durationDays: 3, notes: '' },
  });

  const dateFrom = form.watch('dateFrom');
  const durationDays = form.watch('durationDays');

  const blockedQuery = useQuery({
    queryKey: ['equipment', equipmentId, 'blocked', searchFromYmd, searchToYmd],
    queryFn: () => getEquipmentBlockedRanges(equipmentId, searchFromYmd, searchToYmd),
  });

  const availableSlots = useMemo(() => {
    if (!blockedQuery.data) return [];
    return computeAvailableSlots(blockedQuery.data, durationDays, {
      horizonDays: RENTAL_BOOKING_HORIZON_DAYS,
      searchFrom: startOfToday(),
    });
  }, [blockedQuery.data, durationDays]);

  useEffect(() => {
    if (!availableSlots.length) {
      if (dateFrom) form.setValue('dateFrom', '');
      return;
    }
    if (!availableSlots.some((slot) => slot.dateFrom === dateFrom)) {
      form.setValue('dateFrom', availableSlots[0]!.dateFrom, { shouldValidate: true });
    }
  }, [availableSlots, dateFrom, form]);

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
    !!pickupAddress.trim() &&
    !!period &&
    availableSlots.some((slot) => slot.dateFrom === dateFrom) &&
    !blockedQuery.isLoading &&
    !blockedQuery.isError;

  const mutation = useMutation({
    mutationFn: async (payload: NewRentalFormData) => {
      if (!user) throw new Error('Nie jesteś zalogowany');
      if (!pickupAddress.trim()) throw new Error('Brak adresu odbioru u właściciela');

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
        notes: data.notes.trim(),
      });
    },
    onSuccess: (rental) => {
      router.replace(rentalConfirmedHref(rental.id));
    },
    onError: (error) => {
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Spróbuj ponownie');
    },
  });

  const durationOptions = useMemo(
    () =>
      RENTAL_DURATION_OPTIONS.map((days) => ({
        value: String(days),
        label: `${days} ${days === 1 ? 'dzień' : 'dni'}`,
      })),
    []
  );

  return {
    form,
    period,
    days,
    totalPrice,
    availableSlots,
    durationOptions,
    slotsLoading: blockedQuery.isLoading,
    slotsError: blockedQuery.isError,
    canSubmit,
    isPending: mutation.isPending,
    submit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
