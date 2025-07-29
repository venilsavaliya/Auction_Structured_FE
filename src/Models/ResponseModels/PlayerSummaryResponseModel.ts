import type { IBaseResponse } from "./IBaseResponse";

export interface PlayerSummaryResponseModel extends IBaseResponse {
  data: PlayerSummary[];
}

export interface PlayerSummary {
  id: number;
  name: string;
  imageUrl: string;
  skill:string;
}