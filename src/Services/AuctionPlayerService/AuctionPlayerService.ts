import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AddAuctionPlayerRequest } from "../../Models/RequestModels/AddAuctionPlayerRequest";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import BaseService from "../BaseService";

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
}

const auctionPlayerService = new AuctionPlayerService();

export default auctionPlayerService;
