import { userDtoSchema } from '@/src/shared/application/schemas/api-primitives';
import { apiClient } from '@/src/shared/api/client';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { z } from 'zod';
import { accountTypeFromApi } from '../constants';
import type { AuthSession, AuthUser } from '../domain/types';
import { clearAuthToken, readAuthToken } from './session-storage';

const usersListSchema = z.array(userDtoSchema);

function mapToAuthUser(dto: z.infer<typeof userDtoSchema>): AuthUser | null {
  if (dto.id == null || !dto.email || !dto.firstName || !dto.lastName) {
    return null;
  }

  return {
    userId: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    accountType: accountTypeFromApi(dto.accountType),
  };
}

async function fetchUserFromApi(): Promise<AuthUser | null> {
  const { data, error, response } = await apiClient.GET('/api/users');
  if (response.status === 401) return null;
  if (error) return null;

  const list = parseApiItem(usersListSchema, data, 'Nieprawidłowa odpowiedź API (użytkownik)');
  return mapToAuthUser(list[0] ?? {});
}

export async function fetchAuthSession(): Promise<AuthSession | null> {
  const token = await readAuthToken();
  if (!token) return null;

  try {
    const user = await fetchUserFromApi();
    if (!user) {
      await clearAuthToken();
      return null;
    }
    return { token, user };
  } catch {
    await clearAuthToken();
    return null;
  }
}
