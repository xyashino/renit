import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthSessionResponse } from '@authentication/infrastructure/auth-api';
import type { AuthSession } from '@authentication/domain/session';

export const AUTH_SESSION_STORAGE_KEY = 'rentit_auth';

export async function readStoredSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

export async function readStoredAuthToken(): Promise<string | null> {
  const session = await readStoredSession();
  return session?.token ?? null;
}

export async function writeStoredSession(response: AuthSessionResponse): Promise<AuthSession> {
  const { token, ...user } = response;
  const session: AuthSession = { token, user };
  await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function clearStoredSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
