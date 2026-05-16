import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';

const numberSchema = z.coerce.number().finite();

export const categoryDtoSchema = z.object({
  id: idSchema.optional(),
  Id: idSchema.optional(),
  name: z.string().optional(),
  Name: z.string().optional(),
  key: z.string().optional(),
  Key: z.string().optional(),
});

export const equipmentDtoSchema = z
  .object({
    id: idSchema.optional(),
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    pricePerDay: numberSchema.optional(),
    deposit: numberSchema.optional(),
    address: z.string().optional(),
    userId: idSchema.optional(),
    status: z.coerce.number().optional(),
    categories: z.array(categoryDtoSchema).optional(),
  })
  .passthrough();

export type CategoryDto = z.infer<typeof categoryDtoSchema>;
export type EquipmentDto = z.infer<typeof equipmentDtoSchema>;
