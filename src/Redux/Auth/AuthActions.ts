import type { UserInfoModel } from "../../Models/UserInfoModel";
import { SET_CURRENT_USER } from "./AuthActionTypes";

export const setCurrentUser = (currentUser: UserInfoModel) => ({
  type: SET_CURRENT_USER,
  payload: currentUser,
});
