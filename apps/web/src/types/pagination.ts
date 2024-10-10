// export interface IPaginationMeta {
//     page: number;
//     take: number;
//     total: number;
//   }

//   export interface IPageableResponse<T> {
//     total: number;
//     data: T[];
//     meta: IPaginationMeta;
//   }

//   export interface IPaginationQueries {
//     take?: number;
//     page?: number;
//     sortBy?: string;
//     sortOrder?: "desc" | "asc";
//   }
export interface IPaginationMeta {
  page: number;
  take: number;
  total: number;
}

export interface IPageableResponse<T> {
  total: number;
  data: T[];
  meta: IPaginationMeta;
}

export interface PaginationQueries {
  take?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'desc' | 'asc';
}

export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
}

export interface PageableResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
