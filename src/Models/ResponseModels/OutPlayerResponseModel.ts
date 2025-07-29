import type { IBaseResponse } from "./IBaseResponse";

export interface OutPlayerResponseModel extends IBaseResponse {
   data : number[]
}

export interface OutPlayer {
    id: number;
}