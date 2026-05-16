import { API_BASE_URL } from '@/src/shared/constants/config';
import type { paths } from './generated/api';
import { getStoredAuthToken } from '@/src/shared/auth/infrastructure/token';
import createClient from 'openapi-fetch';

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.use({
  async onRequest({ request }) {
    const token = await getStoredAuthToken();
    if (token) request.headers.set('Authorization', `Bearer ${token}`);
    return request;
  },
});
