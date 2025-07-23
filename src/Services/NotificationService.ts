import { ApiRoutes } from "../Constants";
import Messages from "../constants/Messages";
import type { NotificationResponseModel } from "../Models/ResponseModels/NotificationResponseModel";
import BaseService from "./BaseService";

class NotificationService extends BaseService {
  
  public getUnreadNotifications(
    userId: number
  ): Promise<NotificationResponseModel> {
    return new Promise<NotificationResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetUnreadNotifications(userId))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            message: Messages.NOTIFICATION_FETCHED,
            data: data,
          });
        })
        .catch((error) => [
          reject({
            isSuccess: false,
            message: Messages.REQUEST_FAILED,
            data: null,
          }),
        ]);
    });
  }

}

const notificationService = new NotificationService();
export default notificationService;
