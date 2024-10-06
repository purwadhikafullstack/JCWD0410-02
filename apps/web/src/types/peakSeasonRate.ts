import { Room } from './room';

export interface PeakSeasonRate {
  id: number;
  price: number;
  startDate: Date;
  endDate: Date;
  isDeleted: boolean;
  roomId: number;
  createdAt: Date;
  updatedAt: Date;
  room: Room;
}
