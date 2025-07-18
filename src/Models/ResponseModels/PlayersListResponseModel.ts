import type { IBaseResponse } from "./IBaseResponse";

export interface PlayersListResponseModel extends IBaseResponse
{
    items:[],
    totalCount:number
}