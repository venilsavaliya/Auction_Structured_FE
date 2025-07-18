import type { IBaseResponse } from "./IBaseResponse";

export interface TeamDetailResposeModel extends IBaseResponse
{
    data : TeamDetail
}

export interface TeamDetail{
    id:number,
    name:string,
    image:string
}