export interface IPaginateParams {
  perPage: number;
  currentPage: number;
  isLengthAware?: boolean;
  dataKey?: string;
}

export interface IWithPagination<Data, TParams = IPaginateParams> {
  data: Data[];
  pagination: IPagination<TParams>;
}

export type IPagination<TParams> = TParams extends { isLengthAware: true }
  ? ILengthAwarePagination
  : IBasePagination;

export interface IBasePagination {
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
}

export interface ILengthAwarePagination extends IBasePagination {
  total: number;
  lastPage: number;
}

declare module 'knex' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Knex {
    // eslint-disable-next-line @typescript-eslint/ban-types
    export interface QueryBuilder<TRecord extends {} = any, TResult = any> {
      paginate<TParams extends IPaginateParams = IPaginateParams>(
        params: Readonly<TParams>
      ): Knex.QueryBuilder<TRecord, IWithPagination<TRecord, TParams>>;
    }
  }
}
