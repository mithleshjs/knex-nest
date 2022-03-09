import { InjectKnex, KnexPagination } from '@mithleshjs/knex-nest';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { printQueryTime } from '../util';

@Injectable()
export class AppService {
  constructor(
    @InjectKnex('postgres') readonly knexPg: Knex,
    @InjectKnex('mysql') readonly knexSQL: Knex
  ) {}

  async getArtistsByOffset(_perPage = 10, _goToPage = 1) {
    const start = Date.now();
    const query = this.knexPg('artist')
      .select('id', 'name')
      .orderBy('id', 'asc');
    const result = await KnexPagination.offsetPaginate({
      query: query,
      perPage: _perPage,
      goToPage: _goToPage,
    });
    const end = Date.now();
    printQueryTime('ArtistQueryByOffset', start, end);
    return result;
  }

  async getArtistsByCursor(
    _cursor: string | number | null,
    _direction: 'next' | 'prev',
    _order: 'asc' | 'desc' = 'asc',
    _perPage: 10
  ) {
    const start = Date.now();
    const artistsQuery = this.knexPg('artist').select('id', 'name');
    const result = await KnexPagination.cursorPaginate({
      query: artistsQuery,
      cursor: {
        key: 'id',
        order: _order,
        value: _cursor || null,
        direction: _direction,
      },
      perPage: _perPage,
    });
    const end = Date.now();
    printQueryTime('ArtistQueryByCursor', start, end);
    return result;
  }

  async getUsers() {
    const users = await this.knexSQL('users').select('id', 'name');
    return users;
  }
}
