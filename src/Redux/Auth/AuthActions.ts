import type { UserInfoModel } from "../../Models/UserInfoModel";
import { LOGOUT,SET_CURRENT_USER } from "./AuthActionTypes";

export const setCurrentUser = (currentUser: UserInfoModel) => ({
  type: SET_CURRENT_USER,
  payload: currentUser,
});

export const logOutUser = () => ({
  type: LOGOUT
});
