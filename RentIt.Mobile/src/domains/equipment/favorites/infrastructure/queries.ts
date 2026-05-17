import type { Equipment } from '@/src/shared/domain/equipment';
import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import { parseEquipmentItem } from '@/src/shared/infrastructure/equipment';
import { parseApiArray } from '@/src/shared/infrastructure/parse-api';
import { favoriteEquipmentDtoSchema } from '../application/schemas/api';

export async function getFavorites(): Promise<Equipment[]> {
  const { data, error } = await apiClient.GET('/api/favorites');
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się załadować ulubionych'));
  }
  const items = parseApiArray(
    favoriteEquipmentDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (ulubione)'
  );
  return items.flatMap((item) => {
    const equipment = item.equipment ? parseEquipmentItem(item.equipment) : null;
    return equipment ? [equipment] : [];
  });
}
