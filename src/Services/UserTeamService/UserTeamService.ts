import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AuctionParticipantRequestModel } from "../../Models/RequestModels/AuctionParticipantRequestModel";
import type { UserTeamResponseModel } from "../../Models/ResponseModels/UserTeamResponseModel";
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
}

const userTeamService = new UserTeamService();
export default userTeamService;