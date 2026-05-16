import { z } from 'zod';

/** Współdzielone przez wiele domen (rentals, profile, auth, …). */
export const idSchema = z.coerce.number().int().finite();

/** Kształt `UserDto` z API — rentals (client), profile. */
export const userDtoSchema = z
  .object({
    id: idSchema.optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    accountType: z.coerce.number().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

export type UserDto = z.infer<typeof userDtoSchema>;
