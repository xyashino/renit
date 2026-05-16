import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';
import { ACCOUNT_TYPES, accountTypeFromApi } from '../../constants';

export const sessionPayloadSchema = z
  .object({
    token: z.string().min(1),
    userId: idSchema,
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    accountType: z
      .union([z.enum(ACCOUNT_TYPES), z.coerce.number(), z.string()])
      .optional(),
  })
  .transform((data) => ({
    token: data.token,
    userId: data.userId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    accountType: accountTypeFromApi(data.accountType),
  }));

export type ApiSessionPayload = z.infer<typeof sessionPayloadSchema>;

const authResponseDtoSchema = z.object({
  token: z.string().min(1),
  userId: idSchema,
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  accountType: z.coerce.number().optional(),
  AccountType: z.coerce.number().optional(),
});

export const apiSessionPayloadSchema = authResponseDtoSchema
  .transform((data) => ({
    token: data.token,
    userId: data.userId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    accountType: data.accountType ?? data.AccountType,
  }))
  .pipe(sessionPayloadSchema);
