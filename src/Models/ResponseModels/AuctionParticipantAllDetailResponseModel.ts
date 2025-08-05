import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionParticipantAllDetailResponseModel
  extends IBaseResponse {
  data: AuctionParticipantAllDetailData;
}

export interface AuctionParticipantAllDetailData {
  totalParticipants: number;
  balanceLeft: number;
  bestScore: number;
  id: number;
  auctionId: number;
  userId: number;
  userName: string;
  imageUrl: string;
  points: number;
  rank: number;
  totalPlayers: number;
}
