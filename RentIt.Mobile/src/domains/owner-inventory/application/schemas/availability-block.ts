import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';

export const equipmentAvailabilityBlockDtoSchema = z.object({
  id: idSchema,
  equipmentId: idSchema,
  dateFrom: z.string(),
  dateTo: z.string(),
  reason: z.string().default(''),
  createdAt: z.string().default(''),
});

export type EquipmentAvailabilityBlockDto = z.infer<typeof equipmentAvailabilityBlockDtoSchema>;
