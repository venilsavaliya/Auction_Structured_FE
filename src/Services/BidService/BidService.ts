import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { BidplaceRequestModel } from "../../Models/RequestModels/BidPlaceRequestModel";
import type { LatestBidRequestModel } from "../../Models/RequestModels/LatestBidRequestModel";
import type { BidResponseModel } from "../../Models/ResponseModels/BidResponseModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import BaseService from "../BaseService";

export class BidService extends BaseService {
  public PlaceBid(request: BidplaceRequestModel): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.BidPlace)
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.BID_PLACED,
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

  public GetLatestBid(
    request: LatestBidRequestModel
  ): Promise<BidResponseModel> {
    return new Promise<BidResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.LatestBid)
        .then((_response) => {
          const data = _response.data;

          resolve({
            isSuccess: true,
            message: Messages.BID_FETCHED,
            data: {
              UserId: data.userId,
              Amount: data.amount,
              AuctionId: data.auctionId,
              PlayerId: data.PlayerId,
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
}

const bidService = new BidService();

export default bidService;
