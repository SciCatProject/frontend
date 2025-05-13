export declare type TablePaginationMode =
  | "client-side"
  | "server-side"
  | "none";
export interface TablePagination {
  length?: number;
  pageIndex?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  showFirstLastButtons?: boolean;
}
