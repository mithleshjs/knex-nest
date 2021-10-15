import { Inject } from '@nestjs/common';
import { KNEX_CONNECTION } from './constants';

export const InjectKnex = () => {
  return Inject(KNEX_CONNECTION);
};
