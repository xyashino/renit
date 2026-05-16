import AsyncStorage from '@react-native-async-storage/async-storage';
import { sessionPayloadSchema } from '../application/schemas/api';
import { AUTH_SESSION_STORAGE_KEY } from '../constants';
import type { ApiSessionPayload, AuthSession } from '../domain/types';

function toAuthSession(payload: ApiSessionPayload): AuthSession {
  const { token, ...user } = payload;
  return { token, user };
}

export async function readStoredSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }

  const result = sessionPayloadSchema.safeParse(parsed);
  if (!result.success) {
    await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }

  return toAuthSession(result.data);
}

export async function readStoredAuthToken(): Promise<string | null> {
  const session = await readStoredSession();
  return session?.token ?? null;
}

export async function writeStoredSession(input: ApiSessionPayload): Promise<AuthSession> {
  await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(input));
  return toAuthSession(input);
}

export async function clearStoredSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
