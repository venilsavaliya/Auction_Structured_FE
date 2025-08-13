import { resolveElements } from "framer-motion";
import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AddAuctionPlayerRequest } from "../../Models/RequestModels/AddAuctionPlayerRequest";
import type { AuctionPlayerFilterParams } from "../../Models/RequestModels/AuctionPlayerFilterParams";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import BaseService from "../BaseService";
import type { AuctionPlayerDetailResponseModel } from "../../Models/ResponseModels/AuctionPlayerDetailResponseModel";

export class AuctionPlayerService extends BaseService {
  public AddPlayerToAuction(
    request: AddAuctionPlayerRequest
  ): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.AuctionPlayer)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.AUCTION_PLAYER_ADDED,
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

  public GetAuctionPlayerList(
    request: AuctionPlayerFilterParams
  ): Promise<AuctionPlayerDetailResponseModel> {
    return new Promise<AuctionPlayerDetailResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.Auctionplayerlist)
        .then((_response) => {
          console.log("response of auctionplayer ",_response)
          resolve({
            isSuccess: true,
            items : _response.data.items,
            totalCount: _response.data.totalCount,
            message: Messages.AUCTION_PLAYER_ADDED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            items:null,
            message: Messages.REQUEST_FAILED,
          });
        });
    });
  }
}

const auctionPlayerService = new AuctionPlayerService();

export default auctionPlayerService;
