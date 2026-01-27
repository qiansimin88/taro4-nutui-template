/** Common API response wrapper */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/** Pagination params */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Pagination response */
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Common list response */
export type ListResponse<T> = ApiResponse<PaginationResponse<T>>;
