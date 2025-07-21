import type { IBaseResponse } from "./IBaseResponse";

export interface MatchesListResponseModel extends IBaseResponse
{
    items:[],
    totalCount:number
}