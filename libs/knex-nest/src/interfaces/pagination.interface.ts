import { Knex } from 'knex';

export interface IOffsetPaginateParams {
  query: Knex.QueryBuilder;
  perPage: number;
  goToPage: number;
  count?: number;
  dataKey?: string;
}

export interface ICursorPaginateParams {
  query: Knex.QueryBuilder;
  cursor: ICursor;
  perPage: number;
  dataKey?: string;
}

export interface ICursor {
  key: string;
  keyAlias?: string;
  value?: string | number;
  order: 'asc' | 'desc';
  direction: 'next' | 'prev';
}
