import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AddMatchRequestModel } from "../../Models/RequestModels/AddMatchRequestModel";
import type { MatchesFilterParams } from "../../Models/RequestModels/MatchesFilterParams";
import type { UpdateMatchRequestModel } from "../../Models/RequestModels/UpdateMatchRequestModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type { MatcheDetailResponseModel } from "../../Models/ResponseModels/MatcheDetailResponseModel";
import type { MatchesListResponseModel } from "../../Models/ResponseModels/MatchesListResponseModel";
import BaseService from "../BaseService";

export class MatchServices extends BaseService
{
    public GetFilteredMatches(
        request: MatchesFilterParams
      ): Promise<MatchesListResponseModel> {
        return new Promise<MatchesListResponseModel>((resolve, reject) => {
          this.post(request, ApiRoutes.GetPaginatedMatchesList)
            .then((_response) => {
              const data = _response.data;
              resolve({
                isSuccess: true,
                items: data.items,
                totalCount: data.totalCount,
                message: Messages.MATCH_FETCHED,
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
    
      public GetMatchById(id: number): Promise<MatcheDetailResponseModel> {
        return new Promise<MatcheDetailResponseModel>((resolve, reject) => {
          this.get(ApiRoutes.GetMatchById(id))
            .then((_response) => {
              const data = _response.data;
              resolve({
                isSuccess: true,
                data: data,
                message: Messages.MATCH_FETCHED,
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
    
      public AddMatch(request: AddMatchRequestModel): Promise<IBaseResponse> {
        return new Promise<IBaseResponse>((resolve, reject) => {
          this.post(request, ApiRoutes.Match)
            .then((_response) => {
              resolve({
                isSuccess: true,
                message: Messages.MATCH_CREATED,
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
    
      public UpdateMatch(request: UpdateMatchRequestModel): Promise<IBaseResponse> {
        return new Promise<IBaseResponse>((resolve, reject) => {
          this.put(request, ApiRoutes.Match)
            .then((_response) => {
              resolve({
                isSuccess: true,
                message: Messages.MATCH_UPDATED,
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

      
    
      public DeleteMatch(id: number): Promise<IBaseResponse> {
        return new Promise<IBaseResponse>((resolve, reject) => {
          this.delete(ApiRoutes.DeleteMatchById(id))
            .then((_response) => {
              resolve({
                isSuccess: true,
                message: Messages.MATCH_DELETED,
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

   const matchService = new MatchServices();

   export default matchService;