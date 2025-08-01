export interface GetAuctionsRequestModel {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search: string;
  fromDate?: string;
  toDate?: string;
  status: string;
  seasonId?: number;
}
