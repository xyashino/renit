import { idSchema, userDtoSchema } from '@/src/shared/application/schemas/api-primitives';
import { accountTypeFromApi } from '@/src/shared/auth';
import { z } from 'zod';

export const userProfileDtoSchema = userDtoSchema
  .extend({
    id: idSchema,
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
  })
  .transform((dto) => ({
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    accountType: accountTypeFromApi(dto.accountType),
  }));

export type UserProfile = z.infer<typeof userProfileDtoSchema>;

export const updateProfilePayloadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1).email(),
});

export type UpdateProfilePayload = z.infer<typeof updateProfilePayloadSchema>;

export const updateProfileRequestSchema = updateProfilePayloadSchema;
