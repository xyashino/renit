import type { ApiCategoryDto, ApiEquipmentDto } from '@/src/shared/api/types';
import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';

const numberLikeSchema = z.union([z.number(), z.string()]);

export const categoryDtoSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  key: z.string().optional(),
});

export const equipmentDtoSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  pricePerDay: numberLikeSchema.optional(),
  deposit: numberLikeSchema.optional(),
  address: z.string().optional(),
  userId: idSchema.optional(),
  status: z.coerce.number().optional(),
  categories: z.array(categoryDtoSchema).optional(),
});

export type CategoryDto = z.infer<typeof categoryDtoSchema>;
export type EquipmentDto = z.infer<typeof equipmentDtoSchema>;
