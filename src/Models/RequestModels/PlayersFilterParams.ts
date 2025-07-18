export interface PlayersFilterParams
{
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc' | string; // restrict to values if possible
    skill: string;
    teamId: number;
    search: string;
    activeStatus?: boolean; // optional if you may omit it sometimes
}