import type { IBaseResponse } from "./IBaseResponse";

export interface PlayerMatchStateDetailResponseModel  extends IBaseResponse{
    data:PlayerMatchStateDetail
}

export interface PlayerMatchStateDetail 
{
  id: number;
  playerId: number;
  matchId: number;
  name: string;
  teamId: number;
  fours: number;
  sixes: number;
  runs: number;
  wickets: number;
  maidenOvers: number;
  catches: number;
  stumpings: number;
  runOuts: number;
  imageUrl?: string;
  totalPoints: number;
}
