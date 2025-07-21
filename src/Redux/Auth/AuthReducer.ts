import {
  SET_CURRENT_USER,
  LOGOUT,
  SET_AUTH_LOADING,
  CLEAR_AUTH_LOADING,
} from "./AuthActionTypes";
import type { UserInfoModel } from "../../Models/UserInfoModel";

interface AuthState {
  currentUser: UserInfoModel | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Initial state
const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case SET_AUTH_LOADING:
      return {
        ...state,
        loading: true,
      };

    case CLEAR_AUTH_LOADING:
      return {
        ...state,
        loading: false,
      };
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
