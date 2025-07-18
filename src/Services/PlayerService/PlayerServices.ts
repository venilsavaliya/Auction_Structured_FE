import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { PlayersFilterParams } from "../../Models/RequestModels/PlayersFilterParams";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type { PlayerDetailResponseModel } from "../../Models/ResponseModels/PlayerDetailResponseModel";
import type { PlayersListResponseModel } from "../../Models/ResponseModels/PlayersListResponseModel";
import BaseService from "../BaseService";

export class PlayerServices extends BaseService
{
    public GetFilteredPlayers(
        request: PlayersFilterParams
      ): Promise<PlayersListResponseModel> {
        return new Promise<PlayersListResponseModel>((resolve, reject) => {
          this.post(request, ApiRoutes.GetPaginatedPlayersList)
            .then((_response) => {
              const data = _response.data;
              resolve({
                isSuccess: true,
                items: data.items,
                totalCount: data.totalCount,
                message: Messages.PLAYER_FETCHED,
              });
            })
            .catch((error) => {
              reject({
                isSuccess: false,
                items: [],
                totalCount: 0,
                message: `${Messages.REQUEST_FAILED} ${error}`,
              });
            });
        });
      }
    
      public GetPlayerById(id: number): Promise<PlayerDetailResponseModel> {
        return new Promise<PlayerDetailResponseModel>((resolve, reject) => {
          this.get(ApiRoutes.GetPlayerById(id))
            .then((_response) => {
              const data = _response.data;
              resolve({
                isSuccess: true,
                data: data,
                message: Messages.PLAYER_FETCHED,
              });
            })
            .catch((error) => {
              reject({
                isSuccess: false,
                data: null,
                message: `${Messages.REQUEST_FAILED} ${error}`,
              });
            });
        });
      }
    
      public AddPlayer(request: FormData): Promise<IBaseResponse> {
        return new Promise<IBaseResponse>((resolve, reject) => {
          this.post(request, ApiRoutes.Player, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then((_response) => {
              resolve({
                isSuccess: true,
                message: Messages.PLAYER_CREATED,
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
    
      public UpdatePlayer(request: FormData): Promise<IBaseResponse> {
        return new Promise<IBaseResponse>((resolve, reject) => {
          this.put(request, ApiRoutes.Player, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then((_response) => {
              resolve({
                isSuccess: true,
                message: Messages.PLAYER_UPDATED,
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
    
      public DeltePlayer(id: number | string): Promise<IBaseResponse> {
        return new Promise<IBaseResponse>((resolve, reject) => {
          this.delete(ApiRoutes.DeleteUserById(id))
            .then((_response) => {
              resolve({
                isSuccess: true,
                message: Messages.PLAYER_DELETED,
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
    };

    const playerService = new PlayerServices();

    export default playerService;