import type { IBaseResponse } from "./IBaseResponse";

export interface PlayerDetailResponseModel extends IBaseResponse
{
    data:PlayerDetail
}

export interface PlayerDetail
{
    playerId: number;
  name: string;
  imageUrl: string;
  basePrice: number;
  age: number;
  country: string;
  isActive: boolean;
  skill: string;
}