import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AuctionParticipantRequestModel } from "../../Models/RequestModels/AuctionParticipantRequestModel";
import type { AuctionParticipantResponseModel, AuctionParticipantsResponseModel } from "../../Models/ResponseModels/AuctionParticipantResponseModel";
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
}

const auctionParticipantService = new AuctionParticipantService();
export default auctionParticipantService;
