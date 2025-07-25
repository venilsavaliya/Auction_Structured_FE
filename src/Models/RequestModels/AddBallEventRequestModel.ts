export interface AddBallEventRequestModel {
  matchId: number;
  inningNumber: number;
  overNumber: number;
  ballNumber: number;
  batsmanId: number;
  nonStrikerId: number;
  bowlerId: number;
  runsScored: number;
  extraType?: string | null;
  extraRuns: number;
  wicketType?: string | null;
  dismissedPlayerId?: number | null;
  fielderId?: number | null;
}
