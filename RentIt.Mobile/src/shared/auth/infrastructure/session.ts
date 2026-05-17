import { userDtoSchema } from '@/src/shared/application/schemas/api-primitives';
import { apiClient } from '@/src/shared/api/client';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import { z } from 'zod';
import { accountTypeFromApi } from '../constants';
import type { ApiSessionPayload, AuthSession, AuthUser } from '../domain/types';

export {
  clearAuthToken,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from './secure-storage';

const usersListSchema = z.array(userDtoSchema);

export function authSessionFromPayload(payload: ApiSessionPayload): AuthSession {
  const { token, userId, email, firstName, lastName, accountType } = payload;
  return {
    token,
    user: { userId, email, firstName, lastName, accountType },
  };
}

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

export async function fetchAuthUser(): Promise<AuthUser | null> {
  const { data, error, response } = await apiClient.GET('/api/users');
  if (response.status === 401) return null;
  if (error) return null;

  const list = parseApiItem(usersListSchema, data, 'Nieprawidłowa odpowiedź API (użytkownik)');
  return mapToAuthUser(list[0] ?? {});
}
