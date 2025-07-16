import {combineReducers} from "redux"
import authReducer from "./Auth/AuthReducer";

export const rootReducer = combineReducers({
    auth : authReducer
})