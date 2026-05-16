import { ROUTES as AUTH_ROUTES } from '@/src/domains/authentication/constants';
import type { Href } from 'expo-router';

export type RentalTab = 'active' | 'pending' | 'history';

export type RentalStatusKey = 'pending' | 'active' | 'completed' | 'cancelled';

export interface RentalStatus {
  id: number;
  key: RentalStatusKey;
  label: string;
}

export const ROUTES = {
  CLIENT_DETAIL: '/client/rental/[id]',
  OWNER_DETAIL: '/owner/rental/[id]',
  CONFIRMED: '/client/rental/confirmed',
  CLIENT_HOME: AUTH_ROUTES.CLIENT_HOME,
  CLIENT_RENTALS: AUTH_ROUTES.CLIENT_RENTALS,
} as const satisfies Record<string, Href>;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function rentalDetailHref(id: number, isOwner = false): Href {
  const pathname = isOwner ? ROUTES.OWNER_DETAIL : ROUTES.CLIENT_DETAIL;
  return { pathname, params: { id: String(id) } };
}

export function rentalConfirmedHref(rentalId: number): Href {
  return { pathname: ROUTES.CONFIRMED, params: { rentalId: String(rentalId) } };
}

/** Matches server `RentalStatus` enum (Pending=0 … Cancelled=3). */
export const RENTAL_STATUSES: RentalStatus[] = [
  { id: 0, key: 'pending', label: 'Oczekujące' },
  { id: 1, key: 'active', label: 'Aktywne' },
  { id: 2, key: 'completed', label: 'Zakończone' },
  { id: 3, key: 'cancelled', label: 'Anulowane' },
];

export const RENTAL_DURATION_OPTIONS = [1, 2, 3, 5, 7, 14] as const;

export type RentalDurationDays = (typeof RENTAL_DURATION_OPTIONS)[number];

export const RENTAL_MIN_DURATION_DAYS = RENTAL_DURATION_OPTIONS[0];
export const RENTAL_MAX_DURATION_DAYS = RENTAL_DURATION_OPTIONS[RENTAL_DURATION_OPTIONS.length - 1];

/** How far ahead to search for available start dates. */
export const RENTAL_SLOT_HORIZON_DAYS = 90;

/** Booking UI: available slots within the next calendar month. */
export const RENTAL_BOOKING_HORIZON_DAYS = 30;

export const RENTAL_TABS: { key: RentalTab; label: string }[] = [
  { key: 'active', label: 'Aktywne' },
  { key: 'pending', label: 'Oczekujące' },
  { key: 'history', label: 'Historia' },
];

export const RENTALS_SCREEN_CLIENT = {
  title: 'Moje wypożyczenia',
  subtitle: 'Zarządzaj swoimi rezerwacjami sprzętu',
  emptyTitle: 'Brak wypożyczeń',
  emptyActive: 'Nie masz aktywnych wypożyczeń',
  emptyPending: 'Brak oczekujących rezerwacji',
  emptyHistory: 'Twoja historia jest pusta',
  errorTitle: 'Nie udalo sie zaladowac wypozyczen.',
  errorDesc: 'Sprawdz polaczenie i sprobuj ponownie.',
} as const;

export const RENTALS_SCREEN_OWNER = {
  title: 'Rezerwacje',
  subtitle: 'Rezerwacje na Twój sprzęt',
  emptyTitle: 'Brak rezerwacji',
  emptyActive: 'Brak aktywnych rezerwacji na Twój sprzęt',
  emptyPending: 'Brak oczekujących rezerwacji',
  emptyHistory: 'Historia rezerwacji jest pusta',
  errorTitle: 'Nie udalo sie zaladowac rezerwacji.',
  errorDesc: 'Sprawdz polaczenie i sprobuj ponownie.',
} as const;

export const RENTAL_CONFIRMED_SCREEN = {
  TITLE: 'Rezerwacja złożona!',
  DESCRIPTION: 'Twoja prośba o wypożyczenie została wysłana do właściciela.',
  RENTALS_BUTTON: 'Moje wypożyczenia',
  BROWSE_BUTTON: 'Powrót do przeglądania',
} as const;

export const RENTAL_DETAIL_SCREEN = {
  TITLE: 'Szczegóły rezerwacji',
  DESCRIPTION: 'Termin, koszt i status Twojej rezerwacji.',
  ERROR_TITLE: 'Nie udało się załadować rezerwacji',
  ERROR_DESC: 'Wystąpił problem podczas pobierania danych.',
  RETRY_LABEL: 'Spróbuj ponownie',
  BACK_LABEL: 'Wróć',
  EQUIPMENT_SECTION: 'Sprzęt',
  DATES_SECTION: 'Termin i koszt',
  NOTES_SECTION: 'Notatka',
  OWNER_ACTIONS_SECTION: 'Akcje właściciela',
  CONFIRM_RENTAL: 'Potwierdź wypożyczenie',
  MARK_COMPLETED: 'Oznacz jako zakończone',
  CANCEL_RENTAL: 'Anuluj rezerwację',
  CANCELLING: 'Anulowanie...',
  FROM_LABEL: 'Od',
  TO_LABEL: 'Do',
  TOTAL_LABEL: 'Razem',
  DAYS_SUFFIX: { one: 'dzień', few: 'dni', many: 'dni' },
} as const;
