export interface RoomNonAvailability {
  id: number;
  startDate: Date;
  endDate: Date;
  roomId: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
