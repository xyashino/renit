import type { BlockedRange } from '@/src/domains/rentals/domain';
import type { Equipment } from '@/src/shared/domain/equipment';
import { parseEquipmentItem } from '@/src/shared/infrastructure/equipment';
import type { BlockedRangeDto, FavoriteEquipmentDto } from '../application/schemas/api';

export interface FavoriteEquipment {
  userId: number;
  equipmentId: number;
  createdAt: string;
  equipment?: Equipment;
}

export function mapFavoriteEquipment(dto: FavoriteEquipmentDto): FavoriteEquipment {
  return {
    userId: dto.userId,
    equipmentId: dto.equipmentId,
    createdAt: dto.createdAt,
    equipment: dto.equipment ? parseEquipmentItem(dto.equipment) : undefined,
  };
}

export function mapBlockedRange(dto: BlockedRangeDto): BlockedRange {
  return {
    dateFrom: dto.dateFrom,
    dateTo: dto.dateTo,
  };
}
