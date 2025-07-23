import type { IBaseResponse } from "./IBaseResponse";

export interface PlayerNameListResponseModel extends IBaseResponse{
 data: PlayerName[];
}

export interface PlayerName
{
    id: number;
    name: string;
}