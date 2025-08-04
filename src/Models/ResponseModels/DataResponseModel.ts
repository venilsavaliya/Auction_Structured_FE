import type { IBaseResponse } from "./IBaseResponse";

export interface DataResponseModel<T> extends IBaseResponse {
    data: T;
}