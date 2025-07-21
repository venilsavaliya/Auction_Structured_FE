import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type {
  ScoringRule,
  ScoringRuleResponse,
} from "../../Models/ResponseModels/ScoringRulesResponseModel";
import BaseService from "../BaseService";

export class ScoringService extends BaseService {
  public GetScoringRules(): Promise<ScoringRuleResponse> {
    return new Promise<ScoringRuleResponse>((resolve, reject) => {
      this.get(ApiRoutes.AllScoringRule)
        .then((_response) => {
            const data = _response.data;
            console.log(data)
          resolve({
            isSuccess: true,
            data: data,
            message: Messages.RULES_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            data: null,
            message: Messages.REQUEST_FAILED,
          });
        });
    });
  }

  public UpdateScoringRules(request: ScoringRule[]): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, ApiRoutes.ScoringRule)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.RULES_UPDATED,
          });
        })
        .catch((e) => {
          reject({
            isSuccess: false,
            message: Messages.REQUEST_FAILED,
          });
        });
    });
  }
}

const scoringService = new ScoringService();

export default scoringService;