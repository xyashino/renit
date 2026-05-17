import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { favoriteEquipmentDtoSchema } from '../application/schemas/api';
import { addFavoriteRequestSchema } from '../application/schemas/favorites';

export async function addFavorite(equipmentId: number): Promise<void> {
  const body = addFavoriteRequestSchema.parse({ equipmentId });
  const { data, error } = await apiClient.POST('/api/favorites', { body });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się dodać do ulubionych'));
  }
  parseApiItem(favoriteEquipmentDtoSchema, data, 'Nieprawidłowa odpowiedź API (ulubione)');
}

export async function removeFavorite(equipmentId: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/favorites/{equipmentId}', {
    params: { path: { equipmentId } },
  });
  if (error) {
    throw new Error(extractApiMessage(error, 'Nie udało się usunąć z ulubionych'));
  }
}
