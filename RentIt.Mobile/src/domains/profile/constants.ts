import { ROUTES as AUTH_ROUTES } from '@/src/shared/auth';
import type { Href } from 'expo-router';

export const ROUTES = {
  SIGN_IN: AUTH_ROUTES.SIGN_IN,
} as const satisfies Record<string, Href>;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const PROFILE_SCREEN = {
  TITLE: 'Profil',
  DESCRIPTION: 'Twoje dane i ustawienia konta.',
  LOGOUT_LABEL: 'Wyloguj',
  LOGOUT_ALERT: 'Wylogowano',
} as const;

export const PROFILE_ACCOUNT_TYPE = {
  HINT: 'Typ konta nie może być zmieniony po rejestracji.',
  client: {
    badge: 'Konto klienta',
    description: 'Przeglądasz oferty i składasz rezerwacje sprzętu.',
  },
  owner: {
    badge: 'Konto właściciela',
    description: 'Dodajesz sprzęt i zarządzasz rezerwacjami na swoje ogłoszenia.',
  },
} as const;
