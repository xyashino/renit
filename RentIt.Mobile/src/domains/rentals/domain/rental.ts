import type { Equipment } from '@/src/shared/domain/equipment';
import type { RentalStatus } from './status';

export interface RentalClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Rental {
  id: number;
  dateFrom: string;
  dateTo: string;
  notes?: string;
  address: string;
  clientId: number;
  equipmentId: number;
  statusId: number;
  client?: RentalClient;
  equipment?: Equipment;
  status?: RentalStatus;
}
