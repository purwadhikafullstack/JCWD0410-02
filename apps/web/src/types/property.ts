import { PropertyFacility } from './propertyFacility';
import { PropertyImage } from './propertyImage';
import { Review } from './review';
import { Room } from './room';
import { Tenant } from './tenant';

export interface Property {
  id: number;
  slug: string;
  title: string;
  category: Category;
  description: string;
  latitude: string;
  longitude: string;
  status: StatusProperty;
  tenantId: number;
  createdAt: Date;
  updatedAt: Date;
  propertyImages: PropertyImage[];
  propertyFacilities: PropertyFacility[];
  reviews: Review[];
  tenant: Tenant[];
  rooms: Room[];
}

enum Category {
  HOTEL = 'HOTEL',
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
}

enum StatusProperty {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}
