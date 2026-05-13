import { apiClient } from '@/src/shared/api/client';
import type { Review } from '../domain';

export async function getReviews(equipmentId: number): Promise<Review[]> {
  const { data, error } = await apiClient.GET('/api/reviews', {
    params: { query: { equipmentId } as any },
  });
  if (error) throw new Error('Nie udało się załadować opinii');
  return (data ?? []) as Review[];
}

export async function createReview(body: {
  rating: number;
  comment?: string;
  authorId: number;
  equipmentId: number;
  rentalId: number;
}): Promise<Review> {
  const { data, error } = await apiClient.POST('/api/reviews', { body: body as any });
  if (error) throw new Error('Nie udało się dodać opinii');
  return data as Review;
}
