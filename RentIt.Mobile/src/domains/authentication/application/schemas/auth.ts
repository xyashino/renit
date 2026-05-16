import { ACCOUNT_TYPE, ACCOUNT_TYPES } from '@/src/shared/auth/constants';
import { z } from 'zod';

const accountTypeSchema = z.enum(ACCOUNT_TYPES);

export const loginRequestSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export const registerPayloadSchema = z.object({
  accountType: accountTypeSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1).email(),
  password: z.string().min(8),
});

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export const registerRequestSchema = registerPayloadSchema.transform((body) => ({
  firstName: body.firstName,
  lastName: body.lastName,
  email: body.email,
  password: body.password,
  accountType: ACCOUNT_TYPE[body.accountType],
}));
