import type { IBaseResponse } from "./IBaseResponse";
import type { PlayerMatchStateDetail } from "./PlayerMatchStateDetailResponseModel";

export interface MatchPointsResponseModel extends IBaseResponse {
  data: MatchPoints;
}

export interface MatchPoints {
  teamAId: number;
  teamBId: number;
  teamAName: string;
  teamBName: string;
  teamAPlayerMatchState: PlayerMatchStateDetail[];
  teamBPlayerMatchState: PlayerMatchStateDetail[];
  matchId: number;
  teamAPoints: number;
  teamBPoints: number;
}
