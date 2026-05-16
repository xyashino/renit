import type { Href } from 'expo-router';

export const ROUTES = {
  ADD: '/owner/equipment/add',
  EDIT: '/owner/equipment/edit',
  RENTALS: '/owner/equipment/rentals',
  AVAILABILITY: '/owner/equipment/availability',
} as const satisfies Record<string, Href | string>;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function equipmentAddHref(): Href {
  return ROUTES.ADD;
}

export function equipmentEditHref(id: number): Href {
  return `${ROUTES.EDIT}?id=${id}`;
}

export function equipmentRentalsHref(id: number): Href {
  return `${ROUTES.RENTALS}?id=${id}`;
}

export function equipmentAvailabilityHref(id: number): Href {
  return `${ROUTES.AVAILABILITY}?id=${id}`;
}

export const MY_EQUIPMENT_SCREEN = {
  TITLE: 'Mój sprzęt',
  DESCRIPTION: 'Zarządzaj swoimi ogłoszeniami.',
  ACTION_LABEL: 'Dodaj',
  EMPTY_TITLE: 'Brak sprzętu',
  EMPTY_DESCRIPTION: 'Dodaj swój pierwszy sprzęt, aby zacząć zarabiać.',
} as const;
