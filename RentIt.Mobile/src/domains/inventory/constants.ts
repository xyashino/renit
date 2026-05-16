import type { Href } from 'expo-router';

export const ROUTES = {
  ADD: '/owner/equipment/add',
  EDIT: '/owner/equipment/edit',
  RENTALS: '/owner/equipment/rentals',
  RENTAL_BLOCK: '/owner/rental/block',
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

export function equipmentRentalBlockHref(id: number): Href {
  return `${ROUTES.RENTAL_BLOCK}?id=${id}`;
}

