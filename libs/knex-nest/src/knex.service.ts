import { Injectable } from '@nestjs/common';
import { Knex, knex } from 'knex';
@Injectable()
export class KnexService {
  public getKnex(config: Knex.Config) {
    return knex(config);
  }
}
