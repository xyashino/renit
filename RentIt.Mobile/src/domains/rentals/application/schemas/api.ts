import type {
  ApiCreateRentalDto,
  ApiRentalDto,
  ApiUpdateRentalStatusDto,
} from '@/src/shared/api/types';
import { idSchema, userDtoSchema } from '@/src/shared/application/schemas/api-primitives';
import { equipmentDtoSchema } from '@/src/shared/application/schemas/equipment';
import { z } from 'zod';

const rentalStatusSchema = z.coerce.number();

export const rentalDtoSchema = z.object({
  id: idSchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  notes: z.string().optional(),
  address: z.string().optional(),
  clientId: idSchema.optional(),
  equipmentId: idSchema.optional(),
  status: rentalStatusSchema.optional(),
  client: userDtoSchema.nullable().optional(),
  equipment: equipmentDtoSchema.nullable().optional(),
});

export const createRentalDtoSchema = z.object({
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  notes: z.string().optional(),
  equipmentId: idSchema,
});

export const updateRentalStatusDtoSchema = z.object({
  status: rentalStatusSchema,
});

export type RentalDto = z.infer<typeof rentalDtoSchema>;
