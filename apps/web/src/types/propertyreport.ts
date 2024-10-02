export interface RoomAvailability {
  map(arg0: (availability: RoomAvailability, index: number) => import("react").JSX.Element): import("react").ReactNode;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface RoomReport {
  roomId: number;
  roomName: string;
  availability: RoomAvailability;
}

export interface PropertyReport {
  rooms: any;
  propertyId: number;
  propertyName: string;
  room: RoomReport[];
}
