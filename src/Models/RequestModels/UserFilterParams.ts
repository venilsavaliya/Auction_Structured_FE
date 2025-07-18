export interface UserFilterParams{
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc' | ''; 
    search: string;
    role: string;
}