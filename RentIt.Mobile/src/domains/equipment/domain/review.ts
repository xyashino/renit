export interface ReviewAuthor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  authorId: number;
  equipmentId: number;
  rentalId: number;
  author?: ReviewAuthor;
}
