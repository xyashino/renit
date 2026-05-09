import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5113',
  default: 'http://localhost:5113',
}) as string;

export const USE_MOCK = true;
