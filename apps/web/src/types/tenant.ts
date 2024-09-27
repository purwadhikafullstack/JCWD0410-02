import { Property } from './property';

export interface Tenant {
  id: number;
  name: string;
  imageUrl: string;
  phone: string;
  userId: number;
  bankName: string;
  bankNumber: string;
  balance: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  properties: Property[];
}
