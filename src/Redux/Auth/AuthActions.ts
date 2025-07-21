import { RoutePaths } from "../../Constants";
import type { UserInfoModel } from "../../Models/UserInfoModel";
import { LOGOUT,SET_CURRENT_USER } from "./AuthActionTypes";

export const setCurrentUser = (currentUser: UserInfoModel) => ({
  type: SET_CURRENT_USER,
  payload: currentUser,
});

export const logOutUser = () => ({
  type: LOGOUT
});

export const forceLogout = () => {
  return (dispatch: any) => {
    dispatch({ type: LOGOUT });
    // localStorage.removeItem("accessToken");
    if (window.location.pathname !== RoutePaths.Login) {
      window.location.href = RoutePaths.Login;
    }
  };
};

// export const fetchCurrentUser = () => async (dispatch: any) => {
//   try {
//     const res = await axios.get("/auth/me");
//     dispatch({
//       type: SET_CURRENT_USER,
//       payload: res.data.data,
//     });
//   } catch (error) {
//     dispatch({ type: LOGOUT }); // Optional: logout on failure
//   }
// };
