import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionsResponseModel extends IBaseResponse {
  items: Auction[];
  totalCount: number;
}

export interface Auction {
  id: string; // or number, depending on your backend
  managerId: string; // or number
  startDate: string; // or Date, depending on your backend
  auctionStatus: string; // or enum if you have defined statuses
  title: string;
  maximumPurseSize: number;
  minimumBidIncreament: number;
  participantsUserIds: string[]; // or number[]
  maximumTeamsCanJoin: number;
  auctionMode: string;
  seasonId: number;
}
