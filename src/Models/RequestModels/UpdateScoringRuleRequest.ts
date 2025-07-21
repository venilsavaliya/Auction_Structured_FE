import type { ScoringRule } from "../ResponseModels/ScoringRulesResponseModel";

export interface UpdateScoringRuleRequest extends ScoringRule
{
    items:ScoringRule[]
}