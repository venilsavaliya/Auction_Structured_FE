import type { IBaseResponse } from "./IBaseResponse";

export interface TeamsResponseModel extends IBaseResponse
{
    items : team[],
    totalCount : number
}

export interface team
{
   id:number,
   name:string,
   image:string
}