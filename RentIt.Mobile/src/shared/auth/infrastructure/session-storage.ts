import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants';

let cachedToken: string | null | undefined;

async function readFromDevice(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }
  return SecureStore.getItemAsync(AUTH_TOKEN_STORAGE_KEY);
}

async function writeToDevice(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(AUTH_TOKEN_STORAGE_KEY, token);
}

async function clearFromDevice(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE_KEY);
  return;
}

export async function readAuthToken(): Promise<string | null> {
  if (cachedToken !== undefined) {
    return cachedToken;
  }
  cachedToken = await readFromDevice();
  return cachedToken;
}

export async function writeAuthToken(token: string): Promise<void> {
  cachedToken = token;
  await writeToDevice(token);
}

export async function clearAuthToken(): Promise<void> {
  cachedToken = null;
  await clearFromDevice();
}
