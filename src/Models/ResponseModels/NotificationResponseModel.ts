import type { IBaseResponse } from "./IBaseResponse";

export interface NotificationResponseModel extends IBaseResponse {
  data: Notification[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  userId: number;
}