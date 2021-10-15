import { Controller, Get } from '@nestjs/common';
import { InjectKnex } from '@mithleshjs/knex-nest';
import { Knex } from 'knex';

@Controller()
export class AppController {
  constructor(@InjectKnex() readonly knex: Knex) {}

  @Get()
  getUsers() {
    return this.knex('users').select('id', 'name').paginate({
      currentPage: 1,
      perPage: 3,
      isLengthAware: false,
    });
  }
}
