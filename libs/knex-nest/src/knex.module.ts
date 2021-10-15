import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { KnexService } from './knex.service';
import {
  IKnexModuleAsyncOptions,
  IKnexModuleOptions,
  IKnexModuleOptionsFactory,
} from './interfaces';
import { connectionFactory } from './knex.provider';
import { KNEX_CONNECTION, KNEX_OPTIONS } from './constants';

@Global()
@Module({
  providers: [KnexService, connectionFactory],
  exports: [KNEX_CONNECTION],
})
export class KnexModule {
  public static register(options: IKnexModuleOptions): DynamicModule {
    return {
      module: KnexModule,
      providers: [
        {
          provide: KNEX_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  public static registerAsync(options: IKnexModuleAsyncOptions): DynamicModule {
    return {
      module: KnexModule,
      providers: [...this.createProviders(options)],
    };
  }

  private static createProviders(options: IKnexModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createOptionsProvider(options)];
    }

    return [
      this.createOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createOptionsProvider(
    options: IKnexModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: KNEX_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: KNEX_OPTIONS,
      useFactory: async (optionsFactory: IKnexModuleOptionsFactory) =>
        await optionsFactory.createKnexModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
