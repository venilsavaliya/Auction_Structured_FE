import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionParticipantResponseModel extends IBaseResponse {
  data: AuctionParticipant;
}
export interface AuctionParticipantsResponseModel extends IBaseResponse {
  data: AuctionParticipant[];
}

export interface AuctionParticipant {
  userId: number;
  auctionId: number;
  fullName: string;
  image: string;
  purseBalance: number;
}
