import type { Href } from 'expo-router';
import { POST_AUTH_ROUTES, type AccountType } from '../constants';

export type { AccountType } from '../constants';
export {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_TO_API,
  ACCOUNT_TYPE_UI,
  ACCOUNT_TYPE_PICKER_OPTIONS,
  POST_AUTH_ROUTES,
} from '../constants';

export function accountTypeFromApi(value: unknown): AccountType {
  if (value === 0 || value === '0' || value === 'Client' || value === 'client') return 'client';
  if (value === 1 || value === '1' || value === 'Owner' || value === 'owner') return 'owner';
  return 'client';
}

export function getPostAuthRoute(accountType: AccountType): Href {
  return POST_AUTH_ROUTES[accountType];
}
