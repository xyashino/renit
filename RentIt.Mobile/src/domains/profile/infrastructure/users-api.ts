import { apiClient } from '@/src/shared/api/client';
import type { UserProfile } from '../domain/user-profile';
import { parseUserProfile } from './mappers';

export async function getUser(id: number): Promise<UserProfile> {
  const { data, error } = await apiClient.GET('/api/users/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować profilu');
  return parseUserProfile(data);
}

export async function updateUser(id: number, body: Partial<UserProfile>): Promise<void> {
  const { error } = await apiClient.PUT('/api/users/{id}', {
    params: { path: { id } },
    body: body as never,
  });
  if (error) throw new Error('Nie udało się zaktualizować profilu');
}
