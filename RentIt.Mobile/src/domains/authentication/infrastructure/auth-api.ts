import { apiClient } from '@/src/shared/api/client';
import { MESSAGES } from '@authentication/constants';
import type { AuthUser } from '@authentication/domain/session';

export type AuthSessionResponse = { token: string } & AuthUser;

function extractApiMessage(error: unknown, fallback: string): string {
  if (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

export async function loginApi(email: string, password: string): Promise<AuthSessionResponse> {
  const { data, error } = await apiClient.POST('/api/auth/login', {
    body: { email, password },
  });
  if (error) throw new Error(extractApiMessage(error, MESSAGES.API_LOGIN_FAILED));
  return data as unknown as AuthSessionResponse;
}

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
};

export async function registerApi(body: RegisterPayload): Promise<AuthSessionResponse> {
  const { data, error } = await apiClient.POST('/api/auth/register', {
    body: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      address: body.address ?? '',
    },
  });
  if (error) throw new Error(extractApiMessage(error, MESSAGES.API_REGISTER_FAILED));
  return data as unknown as AuthSessionResponse;
}
