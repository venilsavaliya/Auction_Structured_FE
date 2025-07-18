import type { IBaseResponse } from "./IBaseResponse";

export interface UserListResponseModel extends IBaseResponse
{
    items : UserDetail[],
    totalCount:number
}

export interface UserDetail
{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    role: string;
    image: string;
    gender: string;
    mobileNumber: string;
    isNotificationOn: boolean;
}

export interface UserDetailResponseModel extends IBaseResponse
{
    data : UserDetail
}