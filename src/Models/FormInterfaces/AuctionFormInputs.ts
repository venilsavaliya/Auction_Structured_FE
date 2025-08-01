export interface AddAuctionFormInputs {
  title: string;
  startDate: string;
  minimumBidIncreament: number;
  maximumPurseSize: number;
  maximumTeamsCanJoin: number;
  auctionMode: boolean;
  participantUserIds: number[];
}

export interface EditAuctionFormInputs extends AddAuctionFormInputs {
  id: number;
}

export interface AuctionFormInputs {
  id?: number; // optional for "Add", present for "Edit"
  title: string;
  startDate: string;
  minimumBidIncreament: number;
  maximumPurseSize: number;
  maximumTeamsCanJoin: number;
  auctionMode: boolean;
  seasonId: number;
  // participantsUserIds? : number[]
};
