import type { IBaseResponse } from "./IBaseResponse";

export type UserRole = "Admin" | "Manager" | "User";
export type Gender = "Male" | "Female" | "Other";

export interface UsersResponseModel extends IBaseResponse {
    items:User[]
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // ISO string format (e.g., "1990-01-01")
  role: UserRole;
  image: string;
  gender: Gender;
  mobileNumber: string;
  isNotificationOn: boolean;
}
