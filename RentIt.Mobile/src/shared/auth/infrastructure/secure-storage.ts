import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants';

let tokenCache: string | null | undefined;

export async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function setStorageItemAsync(key: string, value: string | null): Promise<void> {
  if (key === AUTH_TOKEN_STORAGE_KEY) {
    tokenCache = value;
  }

  if (Platform.OS === 'web') {
    if (value === null) {
      await AsyncStorage.removeItem(key);
      return;
    }
    await AsyncStorage.setItem(key, value);
    return;
  }

  if (value === null) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getAuthToken(): Promise<string | null> {
  if (tokenCache !== undefined) {
    return tokenCache;
  }
  tokenCache = await getStorageItemAsync(AUTH_TOKEN_STORAGE_KEY);
  return tokenCache;
}

export async function setAuthToken(token: string): Promise<void> {
  await setStorageItemAsync(AUTH_TOKEN_STORAGE_KEY, token);
}

export async function removeAuthToken(): Promise<void> {
  await setStorageItemAsync(AUTH_TOKEN_STORAGE_KEY, null);
}

/** @deprecated Użyj `removeAuthToken`. */
export const clearAuthToken = removeAuthToken;
