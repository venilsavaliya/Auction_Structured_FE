import type { CricketEventKey } from "../../constants/CricketEventType";
import type { IBaseResponse } from "./IBaseResponse";

export interface ScoringRuleResponse extends IBaseResponse {
  data: ScoringRule[];
}

export interface ScoringRule {
  eventType: CricketEventKey;
  points: number;
}
