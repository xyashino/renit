import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { equipmentDtoSchema } from '@/src/shared/application/schemas/equipment';
import { z } from 'zod';

export const favoriteEquipmentDtoSchema = z.object({
  userId: idSchema,
  equipmentId: idSchema,
  createdAt: z.string().default(''),
  equipment: equipmentDtoSchema.nullable().optional(),
});

export const blockedRangeDtoSchema = z.object({
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
});

export type FavoriteEquipmentDto = z.infer<typeof favoriteEquipmentDtoSchema>;
export type BlockedRangeDto = z.infer<typeof blockedRangeDtoSchema>;
