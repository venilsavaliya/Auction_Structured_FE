import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionParticipantDetailResponse extends IBaseResponse
{
    items : AuctionParticipantDetailItem[]
}
export interface AuctionParticipantDetailItem {
    id: number;
    auctionId: number;
    userId: number;
    userName: string;
    imageUrl: string;
    points: number;
    totalPlayers: number;
}