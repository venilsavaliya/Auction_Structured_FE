import type { IBaseResponse } from "./IBaseResponse";

export type PlayerSkill = 'Batsman' | 'Bowler' | 'AllRounder' | 'WKBatsman' | 'WKBowler';

export interface UserTeamResponseModel extends IBaseResponse
{
    items: UserTeam[]
}

export interface UserTeam
{
    playerId: number;
    price: number;
    name: string;
    skill: PlayerSkill;
    image: string;
}