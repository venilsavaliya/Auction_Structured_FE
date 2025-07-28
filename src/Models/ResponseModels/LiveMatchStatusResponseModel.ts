import type { IBaseResponse } from "./IBaseResponse";

export interface BatsmanStatus {
  playerId: number;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOnStrike: boolean;
}

export interface BowlerStatus {
  playerId: number;
  name: string;
  overs: number;
  runsConceded: number;
  wickets: number;
}

export interface BallSummary {
  overNumber: number;
  ballNumber: number;
  result: string;
  isLegalDelivery: boolean;
}

export interface LiveMatchStatusData {
  matchId: number;
  matchStatus: string;
  inningStateId: number;
  teamA: string;
  teamB: string;
  teamAId: number;
  teamBId: number;
  inningNumber: number;
  totalRuns: number;
  totalWickets: number;
  battingTeamId: number;
  bowlingTeamId: number;
  overs: number;
  target?: number | null;
  requiredRunRate?: number | null;
  runRate: number;
  currentBatsmen: BatsmanStatus[];
  currentBowler: BowlerStatus;
  recentBalls: BallSummary[];
}

export interface LiveMatchStatusResponseModel extends IBaseResponse {
  data: LiveMatchStatusData;
} 