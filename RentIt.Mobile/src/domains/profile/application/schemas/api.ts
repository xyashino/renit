import { idSchema, userDtoSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';

export const userProfileDtoSchema = userDtoSchema.extend({
  id: idSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

export type UserProfileDto = z.infer<typeof userProfileDtoSchema>;
