import type { UserInfoModel } from "../../Models/UserInfoModel";
import BaseService from "../BaseService";

export class CurrentUserService extends BaseService {
  public GetCurrentUser(): Promise<UserInfoModel> {
    return new Promise<UserInfoModel>((resolve, reject) => {
      this.get(this.serviceConstants.CurrentUser)
        .then((_response) => {
            console.log("res",_response)
          resolve({
            id: _response.data.id,
            email: _response.data.email,
            imageUrl: _response.data.imageUrl,
            isNotificationOn: _response.data.isNotificationOn,
            role: _response.data.role,
          });
        })
        .catch((exception) => {
          console.log(exception);
          reject({
            id: "",
            email: "",
            imageUrl: "",
            isNotificationOn: "",
            role: "",
          });
        });
    });
  }
}

const currentUserService = new CurrentUserService();

export default currentUserService;
