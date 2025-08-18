export interface AddPlayerMatchStateRequestModel {
  playerId: number;
  matchId: number;
  teamId: number;
  fours: number;
  sixes: number;
  runs: number;
  wickets: number;
  maidenOvers: number;
  catches: number;
  stumpings: number;
  runOuts: number;
  orderNumber:number;
}
