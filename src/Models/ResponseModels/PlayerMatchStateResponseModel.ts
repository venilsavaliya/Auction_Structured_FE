import type { IBaseResponse } from "./IBaseResponse";

export interface PlayerMatchStateResponseModel extends IBaseResponse {
  data: PlayerMatchState[];
}

export interface PlayerMatchState
{
  id: number;
  playerId: number;
  name: string;
  matchId: number;
  teamId: number;
  fours: number;
  sixes: number;
  runs: number;
  wickets: number;
  maidenOvers: number;
  catches: number;
  stumpings: number;
  runOuts: number;
}
