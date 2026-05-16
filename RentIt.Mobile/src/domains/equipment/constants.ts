import type { Href } from 'expo-router';

export const ROUTES = {
  DETAIL: '/client/equipment/[id]',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function equipmentDetailHref(id: number): Href {
  return `/client/equipment/${id}`;
}
