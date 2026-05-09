import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidłowy adres e-mail'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane'),
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidłowy adres e-mail'),
  address: z.string().min(1, 'Adres jest wymagany'),
  password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane'),
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidłowy adres e-mail'),
  address: z.string().min(1, 'Adres jest wymagany'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
