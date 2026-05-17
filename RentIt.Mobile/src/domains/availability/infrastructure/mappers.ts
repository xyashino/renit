import type { EquipmentAvailabilityBlockDto } from '../application/schemas/api';
import type { EquipmentAvailabilityBlock } from '../domain/availability-block';

export function mapEquipmentAvailabilityBlock(
  dto: EquipmentAvailabilityBlockDto
): EquipmentAvailabilityBlock {
  return {
    id: dto.id,
    equipmentId: dto.equipmentId,
    dateFrom: dto.dateFrom,
    dateTo: dto.dateTo,
    reason: dto.reason,
    createdAt: dto.createdAt,
  };
}
