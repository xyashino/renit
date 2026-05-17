import { RENTAL_DURATION_OPTIONS } from '../../constants';
import { z } from 'zod';

const durationSchema = z
  .number()
  .int()
  .refine(
    (value): value is (typeof RENTAL_DURATION_OPTIONS)[number] =>
      (RENTAL_DURATION_OPTIONS as readonly number[]).includes(value),
    'Wybierz czas wypożyczenia'
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
