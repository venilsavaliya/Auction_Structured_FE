import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionPlayerDetailResponseModel extends IBaseResponse
{
    items : AuctionPlayerDetail[],
    totalCount : number
}

export interface AuctionPlayerDetail{
    playerId :number,
    playerName : string,
    playerSkill :string,
    soldPrice :number,
    status : string,
    soldTo :string
}