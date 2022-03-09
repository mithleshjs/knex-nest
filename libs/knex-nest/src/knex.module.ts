import { Global, DynamicModule, Provider } from '@nestjs/common';
import {
  IKnexModuleAsyncOptions,
  IKnexModuleOptions,
  IKnexModuleOptionsFactory,
} from './interfaces';
import { KnexService } from './knex.service';
import { getConnectionToken, getOptionToken } from './knex.util';

@Global()
export class KnexModule {
  public static register(options: IKnexModuleOptions): DynamicModule {
    return {
      module: KnexModule,
      providers: [
        KnexService,
        {
          provide: getConnectionToken(options.configTag),
          useFactory: async (knexService) => {
            return knexService.getKnex(options.config);
          },
          inject: [KnexService],
        },
      ],
      exports: [getConnectionToken(options.configTag)],
    };
  }

  public static registerAsync(options: IKnexModuleAsyncOptions): DynamicModule {
    return {
      module: KnexModule,
      providers: [
        ...this.createProviders(options),
        KnexService,
        {
          provide: getConnectionToken(options.configTag),
          useFactory: async (knexService, options: IKnexModuleOptions) => {
            return knexService.getKnex(options.config);
          },
          inject: [KnexService, getOptionToken(options.configTag)],
        },
      ],
      exports: [getConnectionToken(options.configTag)],
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
        provide: getOptionToken(options.configTag),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: getOptionToken(options.configTag),
      useFactory: async (optionsFactory: IKnexModuleOptionsFactory) =>
        await optionsFactory.createKnexModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
