import type { Review } from '@equipment/domain';
import { apiClient } from './client';

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
