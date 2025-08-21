import type { IBaseResponse } from "./IBaseResponse";

export type PlayerSkill =
  | "Batsman"
  | "Bowler"
  | "AllRounder"
  | "WKBatsman"
  | "WKBowler";

export interface UserTeamResponseModel extends IBaseResponse {
  items: UserTeamPlayer[];
}

export interface UserTeamOfMatchResponseModel extends IBaseResponse {
  items: UserTeamPlayerOfMatch[];
}

export interface UserTeamPlayer {
  playerId: number;
  price: number;
  name: string;
  skill: PlayerSkill;
  image: string;
}

export interface UserTeamPlayerOfMatch {
  playerId: number;
  name: string;
  image: string;
}
