import type { IBaseResponse } from "./IBaseResponse";

export interface SeasonStatusResponseModel extends IBaseResponse {
  data: SeasonStatusResponse;
}

export interface SeasonStatusResponse {
  id: number;
  isSeasonStarted: boolean;
}
