import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AddPlayerMatchStateRequestModel } from "../../Models/RequestModels/AddPlayerMatchStateRequestModel";
import type { PlayerMatchStateRequestParamsModel } from "../../Models/RequestModels/PlayerMatchStateRequestParamsModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type { PlayerMatchState, PlayerMatchStateResponseModel } from "../../Models/ResponseModels/PlayerMatchStateResponseModel";
import BaseService from "../BaseService";

export class PlayerMatchStateService extends BaseService {
  public AddPlayerMatchState(
    request: AddPlayerMatchStateRequestModel
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.PlayerMatchState)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.PLAYER_MATCH_STATE_ADDED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            message: `${Messages.REQUEST_FAILED} ${error}`,
          });
        });
    });
  }

  public GetPlayerMatchState(
    request: PlayerMatchStateRequestParamsModel
  ): Promise<PlayerMatchStateResponseModel> {
    return new Promise<PlayerMatchStateResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.GetPlayerMatchState)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            data: data,
            message: Messages.PLAYER_MATCH_STATE_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            data: [],
            message: `${Messages.REQUEST_FAILED} ${error}`,
          });
        });
    });
  }

  public UpdatePlayerMatchState(
    request: PlayerMatchState[]
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, ApiRoutes.PlayerMatchState)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.PLAYER_MATCH_STATE_UPDATED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            message: `${Messages.REQUEST_FAILED} ${error}`,
          });
        });
    });
  }
}

const playerMatchStateService = new PlayerMatchStateService();
export default playerMatchStateService;
