import { z } from 'zod';

export const availabilityBlockFormSchema = z
  .object({
    dateFrom: z.string().min(1, 'Wybierz datę od'),
    dateTo: z.string().min(1, 'Wybierz datę do'),
    reason: z.string(),
  })
  .refine(
    (data) => new Date(`${data.dateFrom}T00:00:00.000Z`) < new Date(`${data.dateTo}T00:00:00.000Z`),
    { message: 'Data od musi być wcześniejsza niż data do', path: ['dateTo'] }
  );

export type AvailabilityBlockFormData = z.infer<typeof availabilityBlockFormSchema>;

export const emptyAvailabilityBlockForm: AvailabilityBlockFormData = {
  dateFrom: '',
  dateTo: '',
  reason: '',
};
