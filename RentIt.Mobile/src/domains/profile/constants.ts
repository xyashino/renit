import { ROUTES as AUTH_ROUTES } from '@/src/shared/auth';
import type { Href } from 'expo-router';

export const ROUTES = {
  SIGN_IN: AUTH_ROUTES.SIGN_IN,
} as const satisfies Record<string, Href>;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

