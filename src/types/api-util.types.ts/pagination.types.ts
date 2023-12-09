export interface Paginated<T> {
  items: T[];
  currentPage: number;
  nextPage: PaginatedDirectionPartial | null;
  previousPage: PaginatedDirectionPartial | null;
  totalPageCount: number;
  limit: number;
}

export interface PaginatedDirectionPartial {
  page: number;
  limit: number;
}
