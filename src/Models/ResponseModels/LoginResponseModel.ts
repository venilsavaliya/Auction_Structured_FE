import type { IBaseResponse} from "./IBaseResponse";

export interface LoginResponseModel extends IBaseResponse {
    refreshToken:string,
    accessToken:string
}

