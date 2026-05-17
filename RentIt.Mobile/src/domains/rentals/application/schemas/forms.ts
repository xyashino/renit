import { RENTAL_BOOKING_HORIZON_DAYS, RENTAL_MIN_DURATION_DAYS } from '../../constants';
import { z } from 'zod';

const durationSchema = z
  .number()
  .int('Podaj liczbę całkowitą dni')
  .min(RENTAL_MIN_DURATION_DAYS, `Minimum ${RENTAL_MIN_DURATION_DAYS} dzień`)
  .max(
    RENTAL_BOOKING_HORIZON_DAYS,
    `Maksymalnie ${RENTAL_BOOKING_HORIZON_DAYS} dni w jednej rezerwacji`
  );

export type NewRentalFormData = {
  dateFrom: string;
  durationDays: number;
  notes: string;
};

export const newRentalSchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Wybierz datę rozpoczęcia'),
  durationDays: durationSchema,
  notes: z.string(),
});
