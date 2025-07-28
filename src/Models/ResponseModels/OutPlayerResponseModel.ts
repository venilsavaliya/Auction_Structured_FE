import type { IBaseResponse } from "./IBaseResponse";

export interface OutPlayerResponseModel extends IBaseResponse {
   data : OutPlayer[]
}

export interface OutPlayer {
    id: number;
}