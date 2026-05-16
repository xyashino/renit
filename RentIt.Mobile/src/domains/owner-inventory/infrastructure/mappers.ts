import type { EquipmentAvailabilityBlockDto } from '../application/schemas/availability-block';

export interface EquipmentAvailabilityBlock {
  id: number;
  equipmentId: number;
  dateFrom: string;
  dateTo: string;
  reason: string;
  createdAt: string;
}

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
