import { API_BASE_URL } from '@/constants/config';
import type { paths } from '@/types/api';
import { getStoredAuthToken } from '@/src/shared/auth/token';
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
