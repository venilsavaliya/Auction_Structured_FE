import { ApiRoutes } from "../../Constants";
import Messages from "../../constants/Messages";
import type { NotificationStatusChangeRequest } from "../../Models/RequestModels/NotificationStatusChangeRequest";
import type { UserFilterParams } from "../../Models/RequestModels/UserFilterParams";
import type { IBaseResponse } from "../../Models/ResponseModels/IBaseResponse";
import type {
  UserDetailResponseModel,
  UserListResponseModel,
  UserNameList,
} from "../../Models/ResponseModels/UserListResponseModel";
import BaseService from "../BaseService";

export class UserService extends BaseService {
  public GetFilteredUsers(
    request: UserFilterParams
  ): Promise<UserListResponseModel> {
    return new Promise<UserListResponseModel>((resolve, reject) => {
      this.post(request, ApiRoutes.GetPaginatedUsersList)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            items: data.items,
            totalCount: data.totalCount,
            message: Messages.USER_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            items: [],
            totalCount: 0,
            message: `${Messages.REQUEST_FAILED} ${error}`,
          });
        });
    });
  }

  public GetUserNameList(): Promise<UserNameList> {
    return new Promise<UserNameList>((resolve, reject) => {
      this.get(ApiRoutes.GetUserNameList)
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            items: data,
            message: Messages.USER_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            items: [],
            message: `${Messages.REQUEST_FAILED} ${error}`,
          });
        });
    });
  }

  public GetUserById(id: number): Promise<UserDetailResponseModel> {
    return new Promise<UserDetailResponseModel>((resolve, reject) => {
      this.get(ApiRoutes.GetUserById(id))
        .then((_response) => {
          const data = _response.data;
          resolve({
            isSuccess: true,
            data: data,
            message: Messages.USER_FETCHED,
          });
        })
        .catch((error) => {
          reject({
            isSuccess: false,
            data: null,
            message: `${Messages.REQUEST_FAILED} ${error}`,
          });
        });
    });
  }

  public AddUser(request: FormData): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(request, ApiRoutes.User, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.USER_CREATED,
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

  public UpdateUser(request: FormData): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.put(request, ApiRoutes.User, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.USER_UPDATED,
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

  public DelteUser(id: number | string): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.delete(ApiRoutes.DeleteUserById(id))
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.USER_DELETED,
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

  public MarkAllNotificatioAsRead(id: number): Promise<IBaseResponse> {
    return new Promise<IBaseResponse>((resolve, reject) => {
      this.post(null, ApiRoutes.MarkAllNotificationAsReadOfUser(id))
        .then((_response) => {
          resolve({
            isSuccess: true,
            message: Messages.NOTIFICATION_MARK_AS_READ,
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

  public ChangeNotificationStatus(request : NotificationStatusChangeRequest):Promise<IBaseResponse>
  {
    return new Promise<IBaseResponse>((resolve,reject)=>[
      this.post(request,ApiRoutes.ChangeNotificationStatus).then((_response)=>{
        resolve({
          isSuccess:true,
          message:Messages.NOTIFICATION_STATUS_CHANGED
        })
      }).catch((error)=>{
        reject({
          isSuccess:false,
          message:Messages.REQUEST_FAILED
        })
      })
    ])
  }
}

const userService = new UserService();

export default userService;
