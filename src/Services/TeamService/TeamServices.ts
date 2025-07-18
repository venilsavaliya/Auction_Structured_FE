import { ApiRoutes, RoutePaths } from "../../Constants";
import Messages from "../../constants/Messages";
import type { TeamsRequestModel } from "../../Models/RequestModels/TeamsRequestModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type { TeamDetailResposeModel } from "../../Models/ResponseModels/TeamDetailResponseModel";
import type { TeamsResponseModel } from "../../Models/ResponseModels/TeamsResponseModel";
import BaseService from "../BaseService";

export class TeamServices extends BaseService {
  public GetTeams(request: TeamsRequestModel): Promise<TeamsResponseModel> {
    return new Promise<TeamsResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.GetPaginatedTeamsList)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            items: data.items,
            message: Messages.TEAM_FETCHED,
            totalCount: data.totalCount,
          });
        })
        .catch((error) => {
          reject({
            items: [],
            isSuccess: false,
            message: `${Messages.REQUEST_FAILED} ${error}`,
            totalCount: 0,
          });
        });
    });
  }

  public GetTeamById(id: number): Promise<TeamDetailResposeModel> {
    return new Promise<TeamDetailResposeModel>((resolve, reject) => {
      this.get(ApiRoutes.GetTeamById(id))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            data: data,
            message: Messages.TEAM_FETCHED,
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

  public AddTeam(request: FormData): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.Team, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.TEAM_CREATED,
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

  public UpdateTeam(request: FormData): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, ApiRoutes.Team, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.TEAM_UPDATED,
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

  public Delteteam(id: number | string): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.delete(ApiRoutes.DeleteTeamById(id))
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.TEAM_DELETED,
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


const teamService = new TeamServices();

export default teamService;