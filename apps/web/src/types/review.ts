export interface Review {
  id: number;
  rating: number;
  review: string;
  userId: number;
  transactionId: number;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}
