import { MaterialIcons } from "@expo/vector-icons";

export type UserRole = 'Owner' | 'Client';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

export interface Category {
  id: number;
  key: string;
  label: string;
  description?: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}

export interface Status {
  id: number;
  key: 'available' | 'rented' | 'unavailable';
  label: string;
}

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

export interface Rental {
  id: number;
  dateFrom: string;
  dateTo: string;
  notes?: string;
  address: string;
  clientId: number;
  equipmentId: number;
  statusId: number;
  client?: AuthUser;
  equipment?: Equipment;
  status?: Status;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  authorId: number;
  equipmentId: number;
  rentalId: number;
  author?: AuthUser;
}
