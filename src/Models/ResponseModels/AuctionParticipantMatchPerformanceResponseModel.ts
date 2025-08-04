import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionParticipantMatchPerformance {
  matchId: number;
  teamName: string;
  date: string;
  userPoints: number;
  rank: number;
  share: number;
}

export interface AuctionParticipantMatchPerformanceResponseModel extends IBaseResponse {
  data: AuctionParticipantMatchPerformance[];
} 