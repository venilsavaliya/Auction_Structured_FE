import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { PlayersFilterParams } from "../../Models/RequestModels/PlayersFilterParams";
import type { UpdatePlayerStatus } from "../../Models/RequestModels/PlayerStatusRequestModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type { PlayerDetailResponseModel } from "../../Models/ResponseModels/PlayerDetailResponseModel";
import type { PlayerNameListResponseModel } from "../../Models/ResponseModels/PlayerNameListResponseModel";
import type { PlayersListResponseModel } from "../../Models/ResponseModels/PlayersListResponseModel";
import type { PlayerSummaryResponseModel } from "../../Models/ResponseModels/PlayerSummaryResponseModel";
import BaseService from "../BaseService";

export class PlayerServices extends BaseService {
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

  public GetPlayersNameList(): Promise<PlayerNameListResponseModel> {
    return new Promise<PlayerNameListResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetPlayersNameList)
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
            data: [],
            message: `${Messages.REQUEST_FAILED} ${error}`,
          });
        });
    });
  }

  public GetPlayersByTeamId(
    teamId: number
  ): Promise<PlayerNameListResponseModel> {
    return new Promise<PlayerNameListResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetPlayersByTeamId(teamId))
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
            data: [],
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

  public GetPlayerSummaryListByTeamId(
    teamId: number
  ): Promise<PlayerSummaryResponseModel> {
    return new Promise<PlayerSummaryResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetPlayerSummaryByTeamId(teamId))
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

  public UpdatePlayerStatus(
    request: UpdatePlayerStatus
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, ApiRoutes.ChangePlayerStatus)
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
      this.delete(ApiRoutes.DeletePlayerById(id))
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

  public ImportPlayersCsv(csvFile: File): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", csvFile);

      this.post(formData, ApiRoutes.ImportPlayersCsv, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.PLAYER_CSV_IMPORTED,
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

const playerService = new PlayerServices();

export default playerService;
