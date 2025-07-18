export interface AuctionRequestModel {
  title: string;
  startDate: string;
  maximumPurseSize: number;
  maximumTeamsCanJoin: number;
  minimumBidIncreament: number;
  participantsUserIds: number[];
  auctionMode: boolean;
}
