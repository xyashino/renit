import { idSchema, userDtoSchema } from '@/src/shared/application/schemas/api-primitives';
import { equipmentDtoSchema } from '@/src/shared/application/schemas/equipment';
import { z } from 'zod';

export const rentalDtoSchema = z
  .object({
    id: idSchema.optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    notes: z.string().optional(),
    address: z.string().optional(),
    clientId: idSchema.optional(),
    equipmentId: idSchema.optional(),
    status: z.coerce.number().optional(),
    client: userDtoSchema.nullable().optional(),
    equipment: equipmentDtoSchema.nullable().optional(),
  })
  .passthrough();

export type RentalDto = z.infer<typeof rentalDtoSchema>;
