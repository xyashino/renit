import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidlowy adres e-mail'),
  password: z.string().min(1, 'Haslo jest wymagane'),
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, 'Imie jest wymagane'),
    lastName: z.string().min(1, 'Nazwisko jest wymagane'),
    email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidlowy adres e-mail'),
    password: z.string().min(8, 'Haslo musi miec co najmniej 8 znakow'),
    confirmPassword: z.string().min(1, 'Potwierdzenie hasla jest wymagane'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasla musza byc takie same',
    path: ['confirmPassword'],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
