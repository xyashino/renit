import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Imie jest wymagane'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane'),
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidlowy adres e-mail'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
