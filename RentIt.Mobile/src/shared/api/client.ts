import { API_BASE_URL } from '@/src/shared/constants/config';
import type { paths } from './generated/api';
import { getAuthToken } from '@/src/shared/auth/infrastructure/secure-storage';
import { ApiError } from '@/src/shared/api/errors';
import createClient from 'openapi-fetch';

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.use({
  async onRequest({ request }) {
    const token = await getAuthToken();
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
  async onResponse({ request, response }) {
    const isAuthRoute = request.url.includes('/api/auth/');
    if (response.status === 401 && !isAuthRoute) {
      throw new ApiError(401);
    }
    return response;
  },
});
