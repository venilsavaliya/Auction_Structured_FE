import { ApiRoutes, RoutePaths } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AddAuctionPlayerRequest } from "../../Models/RequestModels/AddAuctionPlayerRequest";
import type { AuctionRequestModel } from "../../Models/RequestModels/AuctionRequestModel";
import type { GetAuctionsRequestModel } from "../../Models/RequestModels/GetAuctionRequestModel";
import type { SetCurrentAuctionPlayerRequest } from "../../Models/RequestModels/SetCurrentAuctionPlayerRequest";
import type { SoldPlayerRequestModel } from "../../Models/RequestModels/SoldPlayerRequestModel";
import type { AuctionDetailResponseModel } from "../../Models/ResponseModels/AuctionDetailResponseModel";
import type { AuctionsResponseModel } from "../../Models/ResponseModels/AuctionsResponseModel";
import type { AuctionTeamResponseModel } from "../../Models/ResponseModels/AuctionTeamResponseModel";
import type { DataResponseModel } from "../../Models/ResponseModels/DataResponseModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type { PlayerResponseModel } from "../../Models/ResponseModels/PlayerDetailResponseModel";
import type { UserAuctionResponseModel } from "../../Models/ResponseModels/UserAuctionResponseModel";
import type { UsersResponseModel } from "../../Models/ResponseModels/UserResponseModel";
import BaseService from "../BaseService";

export class AuctionService extends BaseService {
  public GetAuctions(
    request: GetAuctionsRequestModel
  ): Promise<AuctionsResponseModel> {
    return new Promise<AuctionsResponseModel>((resolve, reject) => {
      this.post(request, RoutePaths.GetPaginatedAuctions)
        .then((_response) => {
          const data = _response.data;
          if (_response) {
            resolve({
              isSuccess: true,
              items: data.items,
              message: Messages.AUCTION_FETCHED,
              totalCount: data.totalCount,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
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
              seasonId: data.seasonId,
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

  public GetAuctionParticipants(
    auctionId: number
  ): Promise<AuctionTeamResponseModel> {
    return new Promise<AuctionTeamResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetAuctionParticipantById(auctionId))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            items: data,
            message: Messages.AUCTION_PARTICIPATE_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            items: [],
            message: Messages.REQUEST_FAILED,
          });
        });
    });
  }

  public MarkPlayerUnSold(
    request: AddAuctionPlayerRequest
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.MarkPlayerUnSold)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.PLAYER_UNSOLD,
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
  public MarkPlayerSold(
    request: SoldPlayerRequestModel
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.MarkPlayerSold)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.PLAYER_SOLD,
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

  public GetCurrentAuctionPlayer(id: number): Promise<PlayerResponseModel> {
    return new Promise<PlayerResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetCurrentAuctionPlayer(id))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.PLAYER_FETCHED,
            data: {
              age: data.age,
              basePrice: data.basePrice,
              country: data.country,
              imageUrl: data.imageUrl,
              isActive: data.isActive,
              name: data.name,
              playerId: data.playerId,
              skill: data.skill,
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

  public SetCurrentAuctionPlayer(
    request: SetCurrentAuctionPlayerRequest
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.SetCurrentAuctionPlayer)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.CURRENT_PLAYER_SET,
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

  public GetNextPlayer(id: number): Promise<PlayerResponseModel> {
    return new Promise<PlayerResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetNextPlayer(id))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.PLAYER_FETCHED,
            data: {
              playerId: data.playerId,
              age: data.age,
              basePrice: data.basePrice,
              country: data.country,
              imageUrl: data.imageUrl,
              isActive: data.isActive,
              name: data.name,
              skill: data.skill,
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

  public GetUsersWhoJoinedAuction(id: number): Promise<UsersResponseModel> {
    return new Promise<UsersResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetUserTeams(id))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.USER_FETCHED,
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

  public GetParticipatedAuctions(
    request: GetAuctionsRequestModel
  ): Promise<UserAuctionResponseModel> {
    return new Promise<UserAuctionResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.GetParticipatedAuctions)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            data: data.items,
            totalCount: data.totalCount,
            message: Messages.AUCTION_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            items: [],
            message: `${Messages.REQUEST_FAILED} ${error}`,
            totalCount: 0,
          });
        });
    });
  }

  public GetSeasonIdFromAuctionId(
    auctionId: number
  ): Promise<DataResponseModel<number>> {
    return new Promise<DataResponseModel<number>>((resolve, reject) => {
      this.get(ApiRoutes.GetSeasonIdFromAuctionId(auctionId))
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.SEASON_ID_FETCHED,
            data: _response,
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

  public MarkAuctionCompleted(auctionId: number): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(null, ApiRoutes.MarkAuctionCompleted(auctionId))
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.AUCTION_UPDATED,
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
