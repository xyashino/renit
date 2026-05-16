import { apiClient } from '@/src/shared/api/client';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { favoriteEquipmentDtoSchema } from '../application/schemas/api';

export async function addFavorite(userId: number, equipmentId: number): Promise<void> {
  const { data, error } = await apiClient.POST('/api/favorites' as never, {
    body: { userId, equipmentId },
  } as never);
  if (error) throw new Error('Nie udało się dodać do ulubionych');
  parseApiItem(
    favoriteEquipmentDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (ulubione)'
  );
}

export async function removeFavorite(_userId: number, equipmentId: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/favorites/{equipmentId}' as never, {
    params: { path: { equipmentId } },
  } as never);
  if (error) throw new Error('Nie udało się usunąć z ulubionych');
}
