import type { Href } from 'expo-router';

export const ROUTES = {
  DETAIL: '/client/equipment/[id]',
} as const satisfies Record<string, Href>;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function equipmentDetailHref(id: number): Href {
  return `/client/equipment/${id}`;
}

export const BROWSE_SCREEN = {
  TITLE: 'Co chcesz wypożyczyć?',
  SUBTITLE: 'Przeglądaj dostępny sprzęt i wybierz kategorię.',
  CATEGORIES_LABEL: 'Kategorie',
  EMPTY_TITLE: 'Brak sprzętu',
  EMPTY_DESCRIPTION: 'Brak sprzętu spełniającego kryteria.',
} as const;

export const FAVORITES_SCREEN = {
  TITLE: 'Ulubione',
  SUBTITLE: 'Zapisane oferty sprzętu.',
  EMPTY_TITLE: 'Brak ulubionych',
  EMPTY_DESCRIPTION: 'Dodaj sprzęt do ulubionych na stronie szczegółów oferty.',
  ERROR_TITLE: 'Nie udało się załadować ulubionych',
  ERROR_DESCRIPTION: 'Sprawdź połączenie i spróbuj ponownie.',
  RETRY_LABEL: 'Odśwież',
} as const;
