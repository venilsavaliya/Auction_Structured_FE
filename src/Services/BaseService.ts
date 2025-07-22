import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import ServiceConstants from "./ServiceConstants";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../Redux/Auth/AuthActionTypes";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../Constants";
import store from "../Redux/Store";
import { forceLogout } from "../Redux/Auth/AuthActions";

export default class BaseService {
  private axiosInstance: AxiosInstance;
  public serviceConstants: ServiceConstants;

  constructor() {
    this.serviceConstants = new ServiceConstants();

    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 70000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response Interceptor - handle 401 or other global responses
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;

        if (status === 401) {
          console.warn("Unauthorized! Logging out...");
          
          store.dispatch(forceLogout());
        }

        return Promise.reject(error);
      }
    );
  }

  post(data: any, endpoint: string, config?: AxiosRequestConfig): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.axiosInstance
        .post(endpoint, data, config)
        .then((response) => resolve(response.data))
        .catch((error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error occurred";

          console.error("Error:", message);

          if (error && error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(null);
          }
        });
    });
  }

  put(data: any, endpoint: string, config?: AxiosRequestConfig): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.axiosInstance
        .put(endpoint, data, config)
        .then((response) => resolve(response.data))
        .catch((error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error occurred";

          console.error("Error:", message);

          if (error && error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(null);
          }
        });
    });
  }

  get(endpoint: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.axiosInstance
        .get(endpoint)
        .then((response) => resolve(response.data))
        .catch((error) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error occurred";

          console.error("Error:", message);

          if (error && error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(null);
          }
        });
    });
  }

  delete(endpoint: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.axiosInstance
        .delete(endpoint)
        .then((response) => resolve(response.data))
        .catch((error) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error occurred";

          console.error("Error:", message);

          if (error && error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(null);
          }
        });
    });
  }
}
