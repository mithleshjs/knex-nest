<style>
  .site-footer {
    display: none;
  }
</style>
<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  Pagination included <a href="https://knexjs.org/" target="blank">Knex</a> module for <a href="https://knexjs.org/" target="blank">Nest</a>
</p>

<p align="center">
  <a href="https://nx.dev/" target="blank"><img src="https://img.shields.io/badge/built%20with-Nx-orange?style=for-the-badge" alt="Nrwl Nx" /></a>
</p>

## Table of Contents

- [Install](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Acknowledgement](#acknowledgement)
- [License](#license)

## Installation

```bash
$ npm install @mithleshjs/knex-nest knex
```
Then install one of the following database drivers according to your database type

```bash
$ npm install pg
$ npm install sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install oracledb
$ npm install tedious
```
## Usage

Import the KnexModule module and pass an `options` object to initialize it. You can pass `options` object using the usual methods for [custom providers](https://docs.nestjs.com/fundamentals/custom-providers) as shown below:

- #### Method #1: Pass `options` object

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from '@mithleshjs/knex-nest';

@Module({
  imports: [
    KnexModule.registerAsync({
      config: {
        client: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: 'your_database_user',
          password: 'your_database_password',
          database: 'myapp_test',
        },
      },
      enablePaginator: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- #### Method #2: useFactory()

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from '@mithleshjs/knex-nest';

@Module({
  imports: [
    KnexModule.registerAsync({
      useFactory: () => ({
        config: {
          client: 'mysql',
          connection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'your_database_user',
            password: 'your_database_password',
            database: 'myapp_test',
          },
        },
        enablePaginator: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- #### Method #3: useClass()

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from '@mithleshjs/knex-nest';
import { DbConfigService } from '../db-config.service';

@Module({
  imports: [
    KnexModule.registerAsync({
      useClass: DbConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```typescript
export class DbConfigService {
  createKnexModuleOptions = () => {
    return {
      config: {
        client: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: 'your_database_user',
          password: 'your_database_password',
          database: 'myapp_test',
        },
      },
      enablePaginator: true,
    };
  };
}
```

- #### Method #4: useExisting()

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from '@mithleshjs/knex-nest';
import { DbConfigService } from '../db-config.service';

@Module({
  imports: [
    KnexModule.registerAsync({
      useExisting: AliasedDbConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Use the `InjectKnex()` decorator to inject the Knex connection as local property to access Knex API object directly. See the example below.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectKnex } from '@mithleshjs/knex-nest';
import { Knex } from 'knex';

@Injectable()
export class AppService {
  constructor(@InjectKnex() readonly knex: Knex) {}

  getUsers() {
    return this.knex('users')
      .select('id', 'name')
      .paginate({ perPage: 10, currentPage: 1 });
  }
}
```

## Configuration

A KnexModule `option` object has the following interface:

```typescript
export interface IKnexModuleOptions {
  config: Knex.Config;
  enablePaginator?: boolean;
}
```

- `config:` configuration object for Knex as described [here](https://knexjs.org/#Installation-client)

- (optional) `enablePaginator:` set to `true` to use pagination.

`Pagination` parameter has the following interface: 

```typescript
export interface IPaginateParams {
  perPage: number;
  currentPage: number;
  isLengthAware?: boolean;
  dataKey?: string;
}
```

- (required) `perPage:` no of records per page
- (required) `currentPage:` current page number
- (optional) `isLengthAware:` set to _**true**_ to show `total` and `lastPage`
- (optional) `dataKey:` sets the name of the data key

## Documentation

- [NX](https://nx.dev/l/r/nest/library)
- [Knex](https://knexjs.org)

## Acknowledgement

- [nestjsplus/knex](https://github.com/nestjsplus/knex)
- [svtslv/nestjs-knex](https://github.com/svtslv/nestjs-knex)
- [felixmosh/knex-paginate](https://github.com/felixmosh/knex-paginate)

## License

Knex-Nest is [MIT licensed](LICENSE).
