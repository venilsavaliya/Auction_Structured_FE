import type { IBaseResponse } from "./IBaseResponse";

export interface PlayerDetailResponseModel extends IBaseResponse
{
    data:PlayerDetail
}

export interface PlayerResponseModel extends IBaseResponse
{
  data: Player
}

export interface Player{

    playerId: number;
    name: string;
    imageUrl: string;
    basePrice: number;
    age: number;
    country: string;
    isActive: boolean;
    skill: string;
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
  dateOfBirth:string;
  teamId:number;
}