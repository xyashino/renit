export const ACCOUNT_TYPES = ['client', 'owner'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_TYPE = {
  client: 0,
  owner: 1,
} as const;

export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const;

export const AUTH_TOKEN_STORAGE_KEY = 'rentit.auth.token';

export const ROUTES = {
  SIGN_UP: '/(auth)/sign-up',
  SIGN_IN: '/(auth)/sign-in',
  CLIENT_HOME: '/client/browse',
  CLIENT_RENTALS: '/client/rentals',
  OWNER_EQUIPMENT: '/owner/equipment',
  OWNER_RENTALS: '/owner/rentals',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const POST_AUTH_ROUTES = {
  client: ROUTES.CLIENT_HOME,
  owner: ROUTES.OWNER_EQUIPMENT,
} as const;

export function accountTypeFromApi(value: unknown): AccountType {
  if (value === 'owner' || value === ACCOUNT_TYPE.owner || value === 1 || value === '1') {
    return 'owner';
  }
  return 'client';
}
