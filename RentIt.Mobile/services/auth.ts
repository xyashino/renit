import { apiClient } from './client';

export type AuthResponse = {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
};

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await apiClient.POST('/api/auth/login', {
    body: { email, password },
  });
  if (error) throw new Error((error as any).message ?? 'Logowanie nie powiodło się');
  return data as unknown as AuthResponse;
}

export async function registerApi(body: {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
}): Promise<AuthResponse> {
  const { data, error } = await apiClient.POST('/api/auth/register', { body });
  if (error) throw new Error((error as any).message ?? 'Rejestracja nie powiodła się');
  return data as unknown as AuthResponse;
}
