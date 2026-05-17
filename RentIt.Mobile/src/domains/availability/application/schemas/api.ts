import type { components } from '@/src/shared/api/generated/api';

type ApiBlockedRangeDto = components['schemas']['BlockedRangeDto'];
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

export const createAvailabilityBlockRequestSchema = z.object({
  equipmentId: idSchema,
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  reason: z.string().optional(),
});

export type CreateAvailabilityBlockRequest = z.infer<typeof createAvailabilityBlockRequestSchema>;

export const blockedRangeDtoSchema = z
  .object({
    dateFrom: z.string().min(1),
    dateTo: z.string().min(1),
  })
  .passthrough() satisfies z.ZodType<ApiBlockedRangeDto>;

export type BlockedRangeDto = z.infer<typeof blockedRangeDtoSchema>;
