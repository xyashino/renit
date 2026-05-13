export type RentalTab = 'active' | 'pending' | 'history';

export const RENTAL_TABS: { key: RentalTab; label: string }[] = [
  { key: 'active', label: 'Aktywne' },
  { key: 'pending', label: 'Oczekujące' },
  { key: 'history', label: 'Historia' },
];

export const RENTALS_SCREEN = {
  TITLE: 'Moje wypożyczenia',
  SUBTITLE: 'Zarządzaj swoimi rezerwacjami sprzętu',
  EMPTY_TITLE: 'Brak wypożyczeń',
  EMPTY_ACTIVE: 'Nie masz aktywnych wypożyczeń',
  EMPTY_PENDING: 'Brak oczekujących rezerwacji',
  EMPTY_HISTORY: 'Twoja historia jest pusta',
  ERROR_TITLE: 'Nie udalo sie zaladowac wypozyczen.',
  ERROR_DESC: 'Sprawdz polaczenie i sprobuj ponownie.',
} as const;
