import type { ApiSessionPayload } from '../application/schemas/api';

export type { ApiSessionPayload };

export type AuthUser = Omit<ApiSessionPayload, 'token'>;

export type AuthSession = {
  token: string;
  user: AuthUser;
};
