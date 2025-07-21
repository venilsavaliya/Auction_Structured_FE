import type { IBaseResponse } from "./IBaseResponse";

export interface ScoringRuleResponse extends IBaseResponse {
  data: ScoringRule[];
}

export interface ScoringRule {
  eventType: string;
  points: number;
}
