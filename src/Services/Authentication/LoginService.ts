import Messages from "../../constants/Messages";
import type { LoginRequestModel } from "../../Models/RequestModels/LoginRequestModel";
import type { LoginResponseModel } from "../../Models/ResponseModels/LoginResponseModel";
import BaseService from "../BaseService";

export class LoginService extends BaseService {
  public Login(request: LoginRequestModel): Promise<LoginResponseModel> {
    return new Promise<LoginResponseModel>((resolve, reject) => {
      this.post(request, this.serviceConstants.Login)
        .then((_response) => {
          
            resolve({
              isSuccess: true,
              accessToken: _response.data.accessToken,
              refreshToken: _response.data.refreshToken,
              message: Messages.LOGIN_SUCCESS,
            });
         
        })
        .catch((exception) => {
          reject({
            isSuccess: false,
            message: exception.message,
            accessToken: "",
            refreshToken: "",
          });
        });
    });
  }
}

const loginService = new LoginService();

export default loginService;
