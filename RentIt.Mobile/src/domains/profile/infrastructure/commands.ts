import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import {
  updateProfileRequestSchema,
  type UpdateProfilePayload,
} from '../application/schemas/profile';

export async function updateUser(id: number, input: UpdateProfilePayload): Promise<void> {
  const body = updateProfileRequestSchema.parse(input);
  const { error } = await apiClient.PUT('/api/users/{id}', {
    params: { path: { id } },
    body,
  });
  if (error) throw new Error(extractApiMessage(error, 'Nie udalo sie zaktualizowac profilu'));
}
