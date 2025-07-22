import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionTeamResponseModel extends IBaseResponse {
  items: AuctionTeam[];
}

export interface AuctionTeam {
  auctionId: number;
  userId: number;
  fullName: string;
  balanceLeft: number;
  totalPlayers: number;
  imageUrl?: string;
}
