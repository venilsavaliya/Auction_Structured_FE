import Messages from "../../constants/Messages";
import type { LogoutResponseModel } from "../../Models/ResponseModels/LogoutResponseModel";
import BaseService from "../BaseService";


export class AuthService extends BaseService{

    public Logout() :Promise<LogoutResponseModel>{
        return new Promise<LogoutResponseModel>((resolve,reject)=>{
            this.post(null,this.serviceConstants.LogOut).then((_response)=>{
                resolve({
                    isSuccess : true,
                    message : Messages.LOGOUT_SUCCESS
                });
            }).catch((error)=>
            {
                reject({
                    isSuccess : false,
                    message : `${Messages.REQUEST_FAILED} ${error}`
                })  
            })
        })
    }
}

const authService = new AuthService();

export default authService;