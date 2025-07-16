import { SET_CURRENT_USER, LOGOUT } from "./AuthActionTypes";
import type { UserInfoModel } from "../../Models/UserInfoModel";

interface AuthState {
  currentUser: UserInfoModel | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
      };

    case LOGOUT:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default authReducer;
