import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AuctionParticipantRequestModel } from "../../Models/RequestModels/AuctionParticipantRequestModel";
import type { ReshufflePlayerRequestModel } from "../../Models/RequestModels/ReshufflePlayerRequestModel";
import type { UserTeamOfMatchRequestModel } from "../../Models/RequestModels/UserTeamOfMatchRequestModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type {
  UserTeamOfMatchResponseModel,
  UserTeamResponseModel,
} from "../../Models/ResponseModels/UserTeamResponseModel";
import BaseService from "../BaseService";

export class UserTeamService extends BaseService {
  public GetUserTeams(
    request: AuctionParticipantRequestModel
  ): Promise<UserTeamResponseModel> {
    return new Promise<UserTeamResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.GetAllTeamPlayers)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.USER_TEAM_FETCHED,
            items: data,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            message: Messages.REQUEST_FAILED,
            items: null,
          });
        });
    });
  }

  public GetUserTeamOfMatch(
    request: UserTeamOfMatchRequestModel
  ): Promise<UserTeamOfMatchResponseModel> {
    return new Promise<UserTeamOfMatchResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.GetAllTeamPlayersOfMatch)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.USER_TEAM_FETCHED,
            items: data,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            message: Messages.REQUEST_FAILED,
            items: null,
          });
        });
    });
  }

  public MarkPlayerForReshuffle(
    request: ReshufflePlayerRequestModel[]
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.MarkPlayerForReshuffle)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.USER_TEAM_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            message: Messages.REQUEST_FAILED,
          });
        });
    });
  }
}

const userTeamService = new UserTeamService();
export default userTeamService;
