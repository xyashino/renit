import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';
import { ACCOUNT_TYPES } from '../../constants';

export const authResponseDtoSchema = z.object({
  token: z.string().min(1),
  userId: idSchema,
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  accountType: z.coerce.number().optional(),
  AccountType: z.coerce.number().optional(),
});

export type AuthResponseDto = z.infer<typeof authResponseDtoSchema>;

const accountTypeSchema = z.enum(ACCOUNT_TYPES, {
  required_error: 'Wybierz typ konta',
  invalid_type_error: 'Wybierz typ konta',
});

export const signInSchema = z.object({
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidlowy adres e-mail'),
  password: z.string().min(1, 'Haslo jest wymagane'),
});

export const signUpSchema = z
  .object({
    accountType: accountTypeSchema,
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
