import type { IBaseResponse } from "./IBaseResponse";

export interface MatcheDetailResponseModel extends IBaseResponse {
  data: MatcheDetail;
}

export interface MatcheDetail {
  matchId: number;
  teamAId: number;
  teamBId: number;
  teamAName: string;
  teamBName: string;
  startDate: string;
}
