import { Inject, Injectable } from '@nestjs/common';
import { knexPaginate } from './knex.pagination';
import { IKnexModuleOptions } from './interfaces';
import { KNEX_OPTIONS } from './constants';
import { knex } from 'knex';

@Injectable()
export class KnexService {
  private readonly knex;
  private readonly enablePaginator: boolean;

  constructor(@Inject(KNEX_OPTIONS) private knexOptions: IKnexModuleOptions) {
    this.enablePaginator = knexOptions.enablePaginator || false;
    this.knex = knex(knexOptions.config);
    if (knexOptions.enablePaginator) {
      knex.QueryBuilder.extend('paginate', knexPaginate);
    }
  }

  public getKnex() {
    return this.knex;
  }
}
