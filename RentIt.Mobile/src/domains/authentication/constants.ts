import { MaterialIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';

export { AUTH_SESSION_QUERY_KEY, AUTH_SESSION_STORAGE_KEY } from '@/src/shared/auth/session-keys';

export const ACCOUNT_TYPES = ['client', 'owner'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ROUTES = {
  SIGN_UP: '/(auth)/sign-up',
  SIGN_IN: '/(auth)/sign-in',
  CLIENT_HOME: '/client/browse',
  CLIENT_RENTALS: '/client/rentals',
  OWNER_EQUIPMENT: '/owner/equipment',
  OWNER_RENTALS: '/owner/rentals',
} as const satisfies Record<string, Href>;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const POST_AUTH_ROUTES: Record<AccountType, Route> = {
  client: ROUTES.CLIENT_HOME,
  owner: ROUTES.OWNER_EQUIPMENT,
};

export const ACCOUNT_TYPE_TO_API: Record<AccountType, number> = {
  client: 0,
  owner: 1,
};

export const ACCOUNT_TYPE_UI = {
  LABEL: 'Typ konta',
  CLIENT_TITLE: 'Klient',
  CLIENT_DESC: 'Przegladaj oferty i skladaj rezerwacje',
  OWNER_TITLE: 'Wlasciciel',
  OWNER_DESC: 'Dodawaj sprzet i zarzadzaj rezerwacjami',
  HINT: 'Typ konta nie moze byc zmieniony po rejestracji',
} as const;

export const ACCOUNT_TYPE_PICKER_OPTIONS: {
  value: AccountType;
  title: string;
  description: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
}[] = [
  {
    value: 'client',
    title: ACCOUNT_TYPE_UI.CLIENT_TITLE,
    description: ACCOUNT_TYPE_UI.CLIENT_DESC,
    icon: 'person-search',
  },
  {
    value: 'owner',
    title: ACCOUNT_TYPE_UI.OWNER_TITLE,
    description: ACCOUNT_TYPE_UI.OWNER_DESC,
    icon: 'storefront',
  },
];

export const MESSAGES = {
  ALERT_TITLE_SIGN_IN_ERROR: 'Blad logowania',
  ALERT_TITLE_SIGN_UP_ERROR: 'Blad rejestracji',
  GENERIC_RETRY: 'Sprobuj ponownie',
  API_LOGIN_FAILED: 'Logowanie nie powiodlo sie',
  API_REGISTER_FAILED: 'Rejestracja nie powiodla sie',
} as const;

export type Message = (typeof MESSAGES)[keyof typeof MESSAGES];

export const BRANDING = {
  APP_TITLE: 'RentIT',
} as const;
