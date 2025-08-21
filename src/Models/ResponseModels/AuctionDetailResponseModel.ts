import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionDetailResponseModel extends IBaseResponse {
  data: AuctionDetail;
}

export interface AuctionDetail {
  id: number;
  title: string;
  managerId: number;
  startDate: string;
  maximumPurseSize: number;
  maximumTeamsCanJoin: number;
  minimumBidIncreament: number;
  participantsUserIds: number[];
  auctionStatus: string;
  auctionMode: boolean;
  isReshuffled:boolean;
  seasonId: number;
}
