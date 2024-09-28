import { PeakSeasonRate } from './peakSeasonRate';
import { RoomFacility } from './roomFacility';
import { RoomImage } from './roomImage';
import { RoomNonAvailability } from './roomNonAvailability';
import { Transaction } from './transaction';

export interface Room {
  id: number;
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
  roomFacilities: RoomFacility[];
  roomImages: RoomImage[];
  roomNonAvailabilities: RoomNonAvailability[];
  peakSeasonRates: PeakSeasonRate[];
  transactions: Transaction[];
}
