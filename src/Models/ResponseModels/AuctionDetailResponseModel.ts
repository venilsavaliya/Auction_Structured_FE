import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionDetailResponseModel extends IBaseResponse {
  data: {
    id: number;
    title: string;
    managerId: number;
    startDate: string;
    maximumPurseSize: number;
    maximumTeamsCanJoin: number;
    minimumBidIncreament: number;
    participantsUserIds: number[];
    auctionStatus: "Live" | "Completed" | "Upcoming" | string;
    auctionMode: boolean;
  };
}
