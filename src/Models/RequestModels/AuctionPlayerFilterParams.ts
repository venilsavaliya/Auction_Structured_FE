import type { PaginationParams } from "./PaginationParams";

export interface AuctionPlayerFilterParams extends PaginationParams
{
    AuctionId : number,
    Name? : string,
    Skill? : string,
    Status? :string
}