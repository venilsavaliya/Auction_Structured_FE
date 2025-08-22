import type { IBaseResponse } from "./IBaseResponse";

export interface AuctionParticipantPlayersResponseModel extends IBaseResponse {
  data: AuctionParticipantPlayersResponse;
}

export interface AuctionParticipantPlayersResponse {
  userId: number;
  totalPlayers: number;
  totalPoints: number;
  totalAmountSpent: number;
  participantsPlayers: ParticipantPlayer[];
}

export interface ParticipantPlayer {
  playerId: number;
  playerName: string;
  playerPoints: number;
  playerPrice: number;
  playerImage: string;
  playerSkill: string;
  playerBoughtPrice: number;
  playersTotalMatches: number;
  isReshuffled: boolean;
  isJoined: boolean;
  isLeave: boolean;
}
