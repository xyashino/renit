import { apiSessionPayloadSchema } from '@/src/shared/auth/application/schemas/api';
import type { ApiSessionPayload } from '@/src/shared/auth/domain/types';
import { apiClient } from '@/src/shared/api/client';
import { extractApiMessage } from '@/src/shared/api/errors';
import { parseApiItem } from '@/src/shared/infrastructure/parse-api';
import {
  loginRequestSchema,
  registerPayloadSchema,
  registerRequestSchema,
  type RegisterPayload,
} from '../application/schemas/auth';

export async function loginApi(email: string, password: string): Promise<ApiSessionPayload> {
  const body = loginRequestSchema.parse({ email, password });
  const { data, error } = await apiClient.POST('/api/auth/login', { body });
  if (error) throw new Error(extractApiMessage(error, 'Login failed'));
  return parseApiItem(apiSessionPayloadSchema, data, 'Invalid auth response');
}

export async function registerApi(input: RegisterPayload): Promise<ApiSessionPayload> {
  const payload = registerPayloadSchema.parse(input);
  const body = registerRequestSchema.parse(payload);
  const { data, error } = await apiClient.POST('/api/auth/register', { body });
  if (error) throw new Error(extractApiMessage(error, 'Registration failed'));
  const session = parseApiItem(apiSessionPayloadSchema, data, 'Invalid auth response');
  if (session.accountType !== payload.accountType) {
    throw new Error('Account type mismatch');
  }
  return session;
}
