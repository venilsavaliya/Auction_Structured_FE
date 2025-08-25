import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { SeasonUpdateRequestModel } from "../../Models/RequestModels/SeasonRequestModel";
import type SeasonRequestModel from "../../Models/RequestModels/SeasonRequestModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type { SeasonListResponseModel } from "../../Models/ResponseModels/SeasonListResponseModel";
import type { SeasonStatusResponseModel } from "../../Models/ResponseModels/SeasonStatusResponseModel";
import BaseService from "../BaseService";

export class SeasonService extends BaseService {
  public GetSeasons(): Promise<SeasonListResponseModel> {
    return new Promise<SeasonListResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.Season)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            items: data,
            message: Messages.SEASON_FETCHED,
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

  public CreateSeason(request: SeasonRequestModel): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.Season)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.SEASON_CREATED,
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

  public UpdateSeason(
    request: SeasonUpdateRequestModel
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, `${ApiRoutes.Season}/${request.id}`)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.SEASON_UPDATED,
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

  public StartSeason(
    request: SeasonUpdateRequestModel
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, `${ApiRoutes.StartSeason}`)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.SEASON_UPDATED,
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

  public GetSeasonStatus(id: number): Promise<SeasonStatusResponseModel> {
    return new Promise<SeasonStatusResponseModel>((resolve, reject) => {
      this.get(`${ApiRoutes.GetSeasonStatusById(id)}`)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.SEASON_FETCHED,
            data: data,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            message: Messages.REQUEST_FAILED,
            data: null,
          });
        });
    });
  }

  // TODO: Implement DeleteSeason method when needed
  // public DeleteSeason(id: number): Promise<IBaseResponse> {
  //   return new Promise<IBaseResponse>((resolve, reject) => {
  //     this.delete(`${ApiRoutes.Season}/${id}`)
  //       .then((_response) => {
  //         resolve({
  //           isSuccess: true,
  //           message: Messages.SEASON_DELETED,
  //         });
  //       })
  //       .catch((error) => {
  //         reject({
  //           isSuccess: false,
  //           message: Messages.REQUEST_FAILED,
  //         });
  //       });
  //   });
  // }
}

const seasonService = new SeasonService();

export default seasonService;
