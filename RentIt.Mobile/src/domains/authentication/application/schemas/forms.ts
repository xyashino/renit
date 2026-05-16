import { ACCOUNT_TYPES } from '@/src/shared/auth/constants';
import { z } from 'zod';

const accountTypeSchema = z.enum(ACCOUNT_TYPES, {
  required_error: 'Wybierz typ konta',
  invalid_type_error: 'Wybierz typ konta',
});

export const signInSchema = z.object({
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidlowy adres e-mail'),
  password: z.string().min(1, 'Haslo jest wymagane'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

const signUpFieldsSchema = z.object({
  accountType: accountTypeSchema,
  firstName: z.string().min(1, 'Imie jest wymagane'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane'),
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidlowy adres e-mail'),
  password: z.string().min(8, 'Haslo musi miec co najmniej 8 znakow'),
  confirmPassword: z.string().min(1, 'Potwierdzenie hasla jest wymagane'),
});

export const signUpSchema = signUpFieldsSchema.refine((data) => data.password === data.confirmPassword, {
  message: 'Hasla musza byc takie same',
  path: ['confirmPassword'],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
