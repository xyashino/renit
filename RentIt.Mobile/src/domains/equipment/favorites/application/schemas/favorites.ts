import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';

export const addFavoriteRequestSchema = z.object({
  equipmentId: idSchema,
});

export type AddFavoriteRequest = z.infer<typeof addFavoriteRequestSchema>;
