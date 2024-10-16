export interface User {
  id: number;
  email: string;
  name: string;
  provider: Provider;
  imageUrl: string;
  role: Role;
  isVerified: boolean;
  isDeleted: boolean;
}

export enum Provider {
  CREDENTIALS = 'CREDENTIALS',
  GOOGLE = 'GOOGLE',
}

export enum Role {
  USER = 'USER',
  TENANT = 'TENANT',
}
