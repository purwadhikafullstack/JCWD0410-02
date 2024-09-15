export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  provider: Provider;
  role: Role;
  isVerified: Boolean;
  isDeleted: Boolean;
}

export enum Provider {
  CREDENTIALS = 'CREDENTIALS',
  GOOGLE = 'GOOGLE',
}

export enum Role {
  USER = 'USER',
  TENANT = 'TENANT',
}
