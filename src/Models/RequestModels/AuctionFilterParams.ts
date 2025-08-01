export interface AuctionFilterParams {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    search: string;
    status: string;
    fromDate?: string; 
    toDate?: string;
    seasonId?: string;
  }
  