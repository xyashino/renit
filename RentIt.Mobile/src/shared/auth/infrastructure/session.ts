import type { ApiSessionPayload, AuthSession } from '../domain/types';

export function authSessionFromPayload(payload: ApiSessionPayload): AuthSession {
  const { token, userId, email, firstName, lastName, accountType } = payload;
  return {
    token,
    user: { userId, email, firstName, lastName, accountType },
  };
}
