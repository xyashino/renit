import { apiClient } from './client';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

export async function getUser(id: number): Promise<UserProfile> {
  const { data, error } = await apiClient.GET('/api/users/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować profilu');
  return data as UserProfile;
}

export async function updateUser(id: number, body: Partial<UserProfile>): Promise<void> {
  const { error } = await apiClient.PUT('/api/users/{id}', {
    params: { path: { id } },
    body: body as any,
  });
  if (error) throw new Error('Nie udało się zaktualizować profilu');
}
