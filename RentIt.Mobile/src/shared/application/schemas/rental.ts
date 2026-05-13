import { z } from 'zod';

export type NewRentalFormData = {
  dateFrom: string;
  durationDays: number;
  address: string;
  notes: string;
};

export const newRentalSchema = z.object({
  dateFrom: z.string().min(1, 'Podaj datę od'),
  durationDays: z.coerce.number().refine(
    (value) => [1, 2, 3, 5, 7, 14].includes(value),
    'Wybierz czas wypożyczenia'
  ),
  address: z.string().min(1, 'Podaj adres odbioru'),
  notes: z.string(),
}) satisfies z.ZodType<NewRentalFormData>;
