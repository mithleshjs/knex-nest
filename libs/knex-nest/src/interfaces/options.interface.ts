import { ModuleMetadata, Type } from '@nestjs/common';
import { Knex } from 'knex';

export interface IKnexModuleOptions {
  config: Knex.Config;
  enablePaginator?: boolean;
}

export interface IKnexModuleOptionsFactory {
  createKnexModuleOptions(): Promise<IKnexModuleOptions> | IKnexModuleOptions;
}

export interface IKnexModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<IKnexModuleOptionsFactory>;
  useExisting?: Type<IKnexModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<IKnexModuleOptions> | IKnexModuleOptions;
}
