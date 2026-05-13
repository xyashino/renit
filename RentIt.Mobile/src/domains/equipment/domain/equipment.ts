import type { Status } from '@/src/shared/domain';
import type { Category } from './category';
import type { Review } from './review';

export interface Tag {
  id: number;
  name: string;
}

export interface Equipment {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  pricePerDay: number;
  deposit: number;
  address: string;
  userId: number;
  categoryId: number;
  statusId: number;
  category?: Category;
  status?: Status;
  tags?: Tag[];
  reviews?: Review[];
}
