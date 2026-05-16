import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(1, 'Podaj nazwę sprzętu'),
  description: z.string(),
  imageUrl: z
    .string()
    .trim()
    .url('Podaj poprawny URL obrazka')
    .or(z.literal('')),
  price: z
    .string()
    .min(1, 'Podaj cenę')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Podaj prawidłową cenę'),
  deposit: z.string(),
  address: z.string().min(1, 'Podaj adres odbioru'),
  categoryIds: z.array(z.number()).min(1, 'Wybierz co najmniej jedną kategorię'),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;
