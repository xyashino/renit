import { apiClient } from '@/src/shared/api/client';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { mapFavoriteEquipment, type FavoriteEquipment } from './mappers';
import { favoriteEquipmentDtoSchema } from '../application/schemas/api';

export async function addFavorite(userId: number, equipmentId: number): Promise<FavoriteEquipment> {
  const { data, error } = await apiClient.POST('/api/favorites' as never, {
    body: { userId, equipmentId },
  } as never);
  if (error) throw new Error('Nie udało się dodać do ulubionych');
  const dto = parseApiItem(
    favoriteEquipmentDtoSchema,
    data,
    'Nieprawidłowa odpowiedź API (ulubione)'
  );
  return mapFavoriteEquipment(dto);
}

export async function removeFavorite(_userId: number, equipmentId: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/favorites/{equipmentId}' as never, {
    params: { path: { equipmentId } },
  } as never);
  if (error) throw new Error('Nie udało się usunąć z ulubionych');
}
