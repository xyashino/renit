import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { userProfileDtoSchema, type UserProfile } from '../application/schemas/profile';

export async function getUser(id: number): Promise<UserProfile> {
  const { data, error } = await apiClient.GET('/api/users/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error(extractApiMessage(error, 'Nie udalo sie zaladowac profilu'));
  return parseApiItem(userProfileDtoSchema, data, 'Nieprawidlowa odpowiedz API (profil)');
}
