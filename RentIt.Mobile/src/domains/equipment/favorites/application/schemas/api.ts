import type { ApiFavoriteEquipmentDto } from '@/src/shared/api/types';
import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { equipmentDtoSchema } from '@/src/shared/application/schemas/equipment';
import { z } from 'zod';

export const favoriteEquipmentDtoSchema = z.object({
  userId: idSchema.optional(),
  equipmentId: idSchema.optional(),
  createdAt: z.string().optional(),
  equipment: equipmentDtoSchema.nullable().optional(),
});

export type FavoriteEquipmentDto = z.infer<typeof favoriteEquipmentDtoSchema>;
