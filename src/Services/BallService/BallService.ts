import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { AddBallEventRequestModel } from "../../Models/RequestModels/AddBallEventRequestModel";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import BaseService from "../BaseService";

export class BallService extends BaseService {
  public AddBallEvent(request: AddBallEventRequestModel): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.BallEvent)
        .then((_response) => {
          resolve(
            {
              isSuccess: true,
              message: Messages.BALL_EVENT_ADDED,
            }
          );
        })
        .catch((error) => {
          reject(
            {
              isSuccess: false,
              message: `${Messages.REQUEST_FAILED} ${error}`,
            }
          );
        });
    });
  }
}

const ballService = new BallService();
export default ballService;
