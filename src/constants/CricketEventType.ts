export const CricketEventType: Record<
 CricketEventKey,string
> = {
  Run: "runs",
  Four: "fours",
  Six: "sixes",
  Catch: "catches",
  Stumping: "stumpings",
  RunOut: "runouts",
  Wicket: "wickets",
  MaidenOver: "maidenOvers",
};

export type CricketEventKey =
  | "Run"
  | "Four"
  | "Six"
  | "Catch"
  | "Stumping"
  | "RunOut"
  | "Wicket"
  | "MaidenOver";