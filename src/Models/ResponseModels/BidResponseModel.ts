import type { IBaseResponse } from "./IBaseResponse";

export interface BidResponseModel extends IBaseResponse
{
    data : Bid
}

export interface Bid 
{
    AuctionId :number;
    UserId:number;
    PlayerId:number;
    Amount:number;
}