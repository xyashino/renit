import { getEquipmentBlockedRanges } from '@/src/domains/availability';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { RENTAL_BOOKING_HORIZON_DAYS } from '../../constants';
import { computeAvailableSlots } from '../../domain/availability';
import { startOfToday, toLocalYmd } from '../../domain/dates';
import type { NewRentalFormData } from '../schemas/forms';

export function useRentalBookingSlots(
  equipmentId: number,
  durationDays: number,
  dateFrom: string,
  form: UseFormReturn<NewRentalFormData>
) {
  const searchFromYmd = useMemo(() => toLocalYmd(startOfToday()), []);
  const searchToYmd = useMemo(
    () => toLocalYmd(dayjs(startOfToday()).add(RENTAL_BOOKING_HORIZON_DAYS, 'day').toDate()),
    []
  );

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

  return {
    availableSlots,
    searchFromYmd,
    searchToYmd,
    slotsLoading: blockedQuery.isLoading,
    slotsError: blockedQuery.isError,
  };
}
