export enum StatusTransaction {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_FOR_PAYMENT_CONFIRMATION = "WAITING_FOR_PAYMENT_CONFIRMATION",
  CANCELLED = "CANCELLED",
  PROCESSED = "PROCESSED",
}

export interface Review {
  rating: number;
  review: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  userId: number;
  roomId: number;
  uuid: string; 
  total: number;
  status: StatusTransaction;
  startDate: string;
  endDate: string;
  paymentProof?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    imageUrl?: string;
  };
  room: {
    name: string;
    property: {
      id: number;
      title: string;
      tenant: {
        name: string;
      };
    };
  };
  reviews?: Review[]; 
}
