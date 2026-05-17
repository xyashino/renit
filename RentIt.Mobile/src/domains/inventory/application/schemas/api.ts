import { idSchema } from '@/src/shared/application/schemas/api-primitives';
import { z } from 'zod';

export const equipmentWritePayloadSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  pricePerDay: z.number().positive(),
  deposit: z.number().min(0),
  address: z.string().min(1),
  statusId: idSchema,
  categoryIds: z.array(idSchema).min(1),
});

export type EquipmentWritePayload = z.infer<typeof equipmentWritePayloadSchema>;

export function toEquipmentApiBody(body: EquipmentWritePayload) {
  return {
    name: body.name,
    description: body.description ?? '',
    imageUrl: body.imageUrl ?? null,
    pricePerDay: body.pricePerDay,
    deposit: body.deposit,
    address: body.address,
    status: body.statusId,
    categoryIds: body.categoryIds,
  };
}
