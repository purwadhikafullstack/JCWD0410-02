export enum StatusTransaction {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_FOR_PAYMENT_CONFIRMATION = "WAITING_FOR_PAYMENT_CONFIRMATION",
  CANCELLED = "CANCELLED",
  PROCESSED = "PROCESSED",
}

export interface Transaction {
  id: number;
  userId: number;
  roomId: number;
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
      property: {
          title: string;
          category: string;
          tenant: {
              name: string;
          };
      };
  };
}
