export interface MatchesFilterParams {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  search: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}
