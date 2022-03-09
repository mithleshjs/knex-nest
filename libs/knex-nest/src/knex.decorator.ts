import { Inject } from '@nestjs/common';

export const InjectKnex = (configTag = 'default') => {
  return Inject(configTag);
};
