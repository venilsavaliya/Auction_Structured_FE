import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AuctionParticipantRequestModel } from "../../Models/RequestModels/AuctionParticipantRequestModel";
import type { AuctionParticipantsDetailRequest } from "../../Models/RequestModels/AuctionParticipantsDetailRequest";
import type { AuctionParticipantDetailResponse } from "../../Models/ResponseModels/AuctionParticipantDetailResponse";
import type {
  AuctionParticipantResponseModel,
  AuctionParticipantsResponseModel,
} from "../../Models/ResponseModels/AuctionParticipantResponseModel";
import type { AuctionParticipantMatchPerformanceResponseModel } from "../../Models/ResponseModels/AuctionParticipantMatchPerformanceResponseModel";
import type { AuctionParticipantAllDetailResponseModel } from "../../Models/ResponseModels/AuctionParticipantAllDetailResponseModel";
import type { AuctionParticipantAllDetailRequestModel } from "../../Models/RequestModels/AuctionParticipantAllDetailRequestModel";
import type { AuctionParticipantPlayersRequestModel } from "../../Models/RequestModels/AuctionParticipantPlayersRequestModel";
import type { AuctionParticipantPlayersResponseModel } from "../../Models/ResponseModels/AuctionParticipantPlayersResponseModel";
import BaseService from "../BaseService";

export class AuctionParticipantService extends BaseService {
  public GetAuctionParticipant(
    request: AuctionParticipantRequestModel
  ): Promise<AuctionParticipantResponseModel> {
    return new Promise<AuctionParticipantResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.GetAuctionParticipantDetail)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.AUCTION_PARTICIPATE_FETCHED,
            data: {
              userId: data.userId,
              auctionId: data.auctionId,
              fullName: data.fullName,
              image: data.image,
              purseBalance: data.pursebalance,
            },
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

  public GetAllParticipantOfAuction(
    id: number
  ): Promise<AuctionParticipantsResponseModel> {
    return new Promise<AuctionParticipantsResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetAuctionParticipantsById(id))
        .then((_response) => {
          const data = _response.data;

          resolve({
            isSuccess: true,
            message: Messages.AUCTION_PARTICIPATE_FETCHED,
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

  public GetAuctionParticipantDetail(
    request: AuctionParticipantsDetailRequest
  ): Promise<AuctionParticipantDetailResponse> {
    return new Promise<AuctionParticipantDetailResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.AuctionParticipantDetail)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.AUCTION_PARTICIPATE_FETCHED,
            items: data,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            message: Messages.REQUEST_FAILED,
            items: [],
          });
        });
    });
  }

  public GetAuctionParticipantMatchPerformance(
    auctionId: number,
    userId: number
  ): Promise<AuctionParticipantMatchPerformanceResponseModel> {
    return new Promise<AuctionParticipantMatchPerformanceResponseModel>(
      (resolve, reject) => {
        this.post(
          {
            auctionId: auctionId,
            userId: userId,
          },
          ApiRoutes.GetAuctionParticipantPerformanceList
        )
          .then((_response) => {
            console.log("api res", _response);
            const data = _response.data;
            resolve({
              isSuccess: true,
              message: Messages.AUCTION_PARTICIPATE_FETCHED,
              data: data,
            });
          })
          .catch((error) => {
            reject({
              isSuccess: false,
              message: Messages.REQUEST_FAILED,
              data: [],
            });
          });
      }
    );
  }

  public GetAuctionParticipantAllDetail(
    request: AuctionParticipantAllDetailRequestModel
  ): Promise<AuctionParticipantAllDetailResponseModel> {
    return new Promise<AuctionParticipantAllDetailResponseModel>(
      (resolve, reject) => {
        this.post(request, ApiRoutes.AuctionParticipantAllDetail)
          .then((_response) => {
            const data = _response.data;
            resolve({
              isSuccess: true,
              message: Messages.AUCTION_PARTICIPATE_FETCHED,
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
      }
    );
  }

  public GetAuctionParticipantPlayersAndDetail(
    request: AuctionParticipantPlayersRequestModel
  ): Promise<AuctionParticipantPlayersResponseModel> {
    return new Promise<AuctionParticipantPlayersResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.AuctionParticipantPlayersAndDetail)
        .then((response) => {
          const data = response.data;
          resolve(
           {
            isSuccess: true,
            message: Messages.AUCTION_PARTICIPATE_PLAYER_FETCHED,
            data: data,
           }
          );
        })
        .catch((error) => {
          reject(
            {
              isSuccess: false,
              message: Messages.REQUEST_FAILED,
              data: null,
            }
          );
        });
    });
  }
}

const auctionParticipantService = new AuctionParticipantService();
export default auctionParticipantService;
