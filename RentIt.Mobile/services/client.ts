import { API_BASE_URL } from '@/constants/config';
import type { paths } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createClient from 'openapi-fetch';

const TOKEN_KEY = 'rentit_auth';

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.use({
  async onRequest({ request }) {
    const raw = await AsyncStorage.getItem(TOKEN_KEY);
    if (raw) {
      const { token } = JSON.parse(raw) as { token: string };
      if (token) request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});
