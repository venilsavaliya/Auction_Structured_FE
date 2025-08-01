import type { IBaseResponse } from "./IBaseResponse";

export interface SeasonListResponseModel extends IBaseResponse {
    items: SeasonResponseModel[];
    totalCount: number;
}

export interface SeasonResponseModel {
    id: number;
    name: string;
}