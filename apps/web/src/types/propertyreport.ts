export interface PropertyCategory {
  categoryId: number;
  categoryName: string;
}

export interface PropertyFacility {
  facilityId: number;
  facilityTitle: string;
  facilityDescription: string;
}

export interface RoomFacility {
  facilityId: number;
  facilityTitle: string;
  facilityDescription: string;
}

export interface SoldOutDate {
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface RoomReport {
  roomId: number;
  roomName: string;
  availability: string;
  soldOutDates: SoldOutDate[];
  price: number;
  stock: number;
  roomFacilities: RoomFacility[];
}

export interface PropertyReport {
  propertyId: number;
  propertyName: string;
  propertyDescription: string;
  propertyCategory: PropertyCategory;
  propertyFacilities: PropertyFacility[];
  rooms: RoomReport[];
}
