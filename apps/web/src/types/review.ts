export interface Review {
  id: number;
  rating: number;
  review: string;
  userId: number;
  transactionId: number;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
  reviewed?: boolean; 
  user?: { name: string }; 
  reply?: string; 
}
