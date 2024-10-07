import { Room } from './room';

export interface RoomNonAvailability {
  id: number;
  startDate: Date;
  endDate: Date;
  isDeleted: boolean;
  reason: string;
  roomId: number;
  createdAt: Date;
  updatedAt: Date;
  room: Room;
}
