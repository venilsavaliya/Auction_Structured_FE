import type { IBaseResponse } from "./IBaseResponse";

export interface UserAuctionResponseModel extends IBaseResponse {
  data: UserAuction[];
  totalCount: number;
}

export interface UserAuction {
  auctionId: number;
  userId: number;
  auctionTitle: string;
  auctionStatus: string;
  startTime: string; // or Date, depending on how you handle it
  amountRemaining: number;
  totalPlayer: number;
}
