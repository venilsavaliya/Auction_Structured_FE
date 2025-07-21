import { ApiRoutes, RoutePaths } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AuctionRequestModel } from "../../Models/RequestModels/AuctionRequestModel";
import type { GetAuctionsRequestModel } from "../../Models/RequestModels/GetAuctionRequestModel";
import type { AuctionDetailResponseModel } from "../../Models/ResponseModels/AuctionDetailResponseModel";
import type { AuctionsResponseModel } from "../../Models/ResponseModels/AuctionsResponseModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import BaseService from "../BaseService";

export class AuctionService extends BaseService {
  public GetAuctions(
    request: GetAuctionsRequestModel
  ): Promise<AuctionsResponseModel> {
    return new Promise<AuctionsResponseModel>((resolve, reject) => {
      this.post(request, RoutePaths.GetPaginatedAuctions)
        .then((_response) => {
          if (_response) {
            resolve({
              isSuccess: true,
              items: _response.items,
              message: Messages.AUCTION_FETCHED,
              totalCount: _response.totalCount,
            });
          } else {
            console.log("No response");
          }
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

  public GetAuctionById(id: number): Promise<AuctionDetailResponseModel> {
    return new Promise<AuctionDetailResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetAuctionById(id))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            data: {
              id: data.id,
              auctionMode: data.auctionMode,
              auctionStatus: data.auctionStatus,
              managerId: data.managerId,
              maximumPurseSize: data.maximumPurseSize,
              maximumTeamsCanJoin: data.maximumTeamsCanJoin,
              minimumBidIncreament: data.minimumBidIncreament,
              participantsUserIds: data.participantsUserIds,
              startDate: data.startDate,
              title: data.title,
            },
            message: Messages.AUCTION_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            data: null,
            message: Messages.REQUEST_FAILED + " " + error,
          });
        });
    });
  }

  public UpdateAuction(
    request: AuctionDetailResponseModel
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, ApiRoutes.Auction)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.AUCTION_UPDATED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            data: null,
            message: Messages.REQUEST_FAILED + " " + error,
          });
        });
    });
  }

  public CreateAuction(request: AuctionRequestModel): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.Auction)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.AUCTION_CREATED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            data: null,
            message: Messages.REQUEST_FAILED + " " + error,
          });
        });
    });
  }

  public DeleteAuction(id: number): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.delete(ApiRoutes.DeleteAuctionById(id))
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.AUCTION_DELETED,
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

const auctionService = new AuctionService();

export default auctionService;
