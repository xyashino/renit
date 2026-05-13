import type { Equipment } from '@equipment/domain';
import type { Status } from './status';

export interface RentalClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
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
  status?: Status;
}
