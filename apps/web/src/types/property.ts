import { PropertyCategory } from './propertyCategory';
import { PropertyFacility } from './propertyFacility';
import { PropertyImage } from './propertyImage';
import { Review } from './review';
import { Room } from './room';
import { Tenant } from './tenant';

export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  status: StatusProperty;
  isDeleted: boolean;
  propertyCategoryId: number;
  tenantId: number;
  createdAt: Date;
  updatedAt: Date;
  propertyImages: PropertyImage[];
  propertyFacilities: PropertyFacility[];
  reviews: Review[];
  rooms: Room[];
  propertycategory: PropertyCategory;
  tenant: Tenant;
}

enum StatusProperty {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}
