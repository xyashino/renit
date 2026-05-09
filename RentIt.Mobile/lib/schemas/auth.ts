import { z } from 'zod';

export {
  signInSchema,
  signUpSchema,
  type SignInFormData,
  type SignUpFormData,
} from '@authentication/application/schemas/auth';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane'),
  email: z.string().min(1, 'E-mail jest wymagany').email('Nieprawidłowy adres e-mail'),
  address: z.string().min(1, 'Adres jest wymagany'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
