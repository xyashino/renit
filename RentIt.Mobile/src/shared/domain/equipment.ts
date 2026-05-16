import type { Status } from '@/src/shared/domain';
import type { Category } from './category';

export interface Equipment {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  pricePerDay: number;
  deposit: number;
  address: string;
  userId: number;
  statusId: number;
  categories?: Category[];
  status?: Status;
}
