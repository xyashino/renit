import type { Equipment } from '@equipment/domain';
import { apiClient } from './client';

export type EquipmentPricing = Pick<Equipment, 'id' | 'pricePerDay'>;

export async function getEquipmentPricing(id: number): Promise<EquipmentPricing> {
  const { data, error } = await apiClient.GET('/api/equipment/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować sprzętu');

  const dto = data as any;
  return {
    id: Number(dto.id),
    pricePerDay: Number(dto.pricePerDay),
  };
}
