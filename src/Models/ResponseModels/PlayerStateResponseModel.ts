import type { IBaseResponse } from "./IBaseResponse";

export interface PlayerStateResponseModel extends IBaseResponse{
    data:PlayerState[]
}

export interface PlayerState {
    id:number;
    name:string;
    team:string;
    runs:number;
    fours:number;
    sixes:number;
    wickets:number;
    maidenOvers:number;
    catches:number;
    stumpings:number;
    runouts:number;
}