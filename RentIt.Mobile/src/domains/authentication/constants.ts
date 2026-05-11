import type { Href } from 'expo-router';

export const AUTH_SESSION_STORAGE_KEY = 'rentit_auth';

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export const ROUTES = {
  POST_AUTH: '/(tabs)',
  SIGN_UP: '/(auth)/sign-up',
  SIGN_IN: '/(auth)/sign-in',
} as const satisfies Record<string, Href>;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

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

export const SIGN_IN_SCREEN = {
  BRANDING_SUBTITLE: 'Witaj ponownie',
  EMAIL_LABEL: 'Adres e-mail',
  EMAIL_PLACEHOLDER: 'uzytkownik@example.com',
  PASSWORD_LABEL: 'Haslo',
  SUBMIT_LABEL: 'Zaloguj sie',
  SWITCH_PROMPT: 'Nie masz konta?',
  SWITCH_CTA: 'Zarejestruj sie',
} as const;

export const SIGN_UP_SCREEN = {
  BRANDING_SUBTITLE: 'Utworz konto',
  FIRST_NAME_LABEL: 'Imie',
  FIRST_NAME_PLACEHOLDER: 'Jan',
  LAST_NAME_LABEL: 'Nazwisko',
  LAST_NAME_PLACEHOLDER: 'Kowalski',
  EMAIL_LABEL: 'Adres e-mail',
  EMAIL_PLACEHOLDER: 'jan@example.com',
  PASSWORD_LABEL: 'Haslo',
  CONFIRM_PASSWORD_LABEL: 'Potwierdz haslo',
  SUBMIT_LABEL: 'Utworz konto',
  SWITCH_PROMPT: 'Masz juz konto?',
  SWITCH_CTA: 'Zaloguj sie',
} as const;
