export interface Address {
  id?: number;
  name: string;
  mobile: string;
  pinCode: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  addressType?: "HOME" | "OFFICE" | "OTHER";
  isDefault?: boolean;
}

export type UserRole = "ROLE_CUSTOMER" | "ROLE_ADMIN";

export interface User {
  id?: number;
  password?: string;
  email: string;
  fullName: string;
  mobile?: string;
  profileImage?: string;
  role: UserRole;
  accountStatus?: string;
  createdAt?: string;
  addresses?: Address[];
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  profileUpdated: boolean;
}
