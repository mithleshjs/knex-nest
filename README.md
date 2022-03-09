<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  Pagination included <a href="https://knexjs.org/" target="blank">Knex</a> module for <a href="https://nestjs.com/" target="blank">Nest</a>
</p>

<p align="center">
  <a href="https://nx.dev/" target="blank"><img src="https://img.shields.io/badge/built%20with-Nx-orange?style=for-the-badge" alt="Nrwl Nx" /></a>
</p>

<p align="center">
<img alt="CodeFactor Grade" src="https://img.shields.io/codefactor/grade/github/mithleshjs/knex-nest?logo=codefactor">
<img alt="npm" src="https://img.shields.io/npm/v/@mithleshjs/knex-nest?color=blue&label=latest&logo=npm">
<img alt="npm" src="https://img.shields.io/npm/dt/@mithleshjs/knex-nest">
</p>



## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Multiple Databases](#multiple-databases)
- [Pagination](#pagination)
- [Documentation](#documentation)
- [Acknowledgement](#acknowledgement)
- [License](#license)

## Installation

```bash
npm install @mithleshjs/knex-nest knex
```

Then install one of the following database drivers according to your database type

```bash
npm install pg
npm install sqlite3
npm install mysql
npm install mysql2
npm install oracledb
npm install tedious
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
    KnexModule.register({
      config: {
        client: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: 'your_database_user',
          password: 'your_database_password',
          database: 'your_database',
        },
      },
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
            database: 'your_database',
          },
        },
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
          database: 'your_database',
        },
      },
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
    return this.knex('users').select('id', 'name')
  }
}
```

## Configuration

A KnexModule `option` object has the following interface:

```typescript
export interface IKnexModuleOptions {
  config: Knex.Config;
  configTag?: string;
}
```

- `config:` configuration object for Knex as described [here](https://knexjs.org/#Installation-client)

- (optional) `configTag:` identifier tag for Knex config, required if you wish to use multiple database connections

## Multiple Databases

You can connect as many databases as you want, you just need to pass a unique `configTag` for each instance.

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from '@mithleshjs/knex-nest';

@Module({
  imports: [
    KnexModule.register({
      config: {
        client: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: 'your_database_user',
          password: 'your_database_password',
          database: 'your_database',
        },
      },
      configTag: 'mysql8',
    }),
    KnexModule.register({
      config: {
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
        searchPath: ['knex', 'public'],
      },
      configTag: 'postgres12',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Pass the `configTag` value in `InjectKnex()` decorator to inject the specific Knex connection. See the example below.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectKnex } from '@mithleshjs/knex-nest';
import { Knex } from 'knex';

@Injectable()
export class AppService {
  constructor(
    @InjectKnex('postgres12') readonly knexPg: Knex,
    @InjectKnex('mysql8') readonly knexSQL: Knex
  ) {}

  getUsers() {
    return this.knexPg('users').select('id', 'name')
  }

  getAuthors() {
    return this.knexSQL('authors').select('id', 'name')
  }
}
```

## Pagination

The pagination functionality has been rewritten as a separate utility as Knex plugin API was not stable. Pagination utility supports both `offset` and `cursor` based pagination.

- ### Offset Pagination

  `KnexPagination.offsetPaginate` parameters has the following interface: </br></br>

  ```typescript
    export interface IOffsetPaginateParams {
      query: Knex.QueryBuilder;
      perPage: number;
      goToPage: number;
      dataKey?: string;
    }
  ```

  - (required) `query:` knex query builder instance
  - (required) `perPage:` no of records per page
  - (required) `goToPage:` the page you want to fetch
  - (optional) `dataKey:` sets the name of the data key
  </br>

  ```typescript
    const query = this.knexPg('artist').select('id', 'name');
    const result = await KnexPagination.offsetPaginate({
        query: query,
        perPage: 10,
        goToPage: 1,
      });
  ```

- ### Cursor Pagination

  `KnexPagination.cursorPaginate` parameters has the following interface: </br></br>

  ```typescript
    export interface ICursorPaginateParams {
      query: Knex.QueryBuilder;
      cursor: ICursor;
      perPage: number;
      dataKey?: string;
    }
  ```

  - (required) `query:` knex query builder instance
  - (required) `cursor:` an object of type `ICursor`
  - (required) `perPage:` no of records per page
  - (optional) `dataKey:` sets the name of the data key
  </br>

  ```typescript
   export interface ICursor {
      key: string;
      value?: string | number;
      order: 'asc' | 'desc';
      direction: 'next' | 'prev';
    }
  ```

  - (required) `key:` name of the column that will be used as `cursor`, it should be **sequential** and **unique**
  - (optional) `value:` the value of the cursor for getting `next/prev` page, omit or pass `null` to get the `first page/last page` depending on `direction`
  - (required) `order:` pass `asc` or `desc` to specify the sorting order of the cursor
  - (required) `direction:` pass `next` to get **next page** or `prev` to get the **prev page**
  </br>

  ```typescript
    const artistsQuery = this.knexPg('artist').select('id', 'name');
    const result = await KnexPagination.cursorPaginate({
      query: artistsQuery,
      cursor: {
        key: 'id',
        order: 'desc',
        value: null,
        direction: 'next',
      },
      perPage: 10,
    });
  ```

## Documentation

- [NX](https://nx.dev/l/r/nest/library)
- [Knex](https://knexjs.org)

## Acknowledgement

- [nestjsplus/knex](https://github.com/nestjsplus/knex)
- [svtslv/nestjs-knex](https://github.com/svtslv/nestjs-knex)
- [felixmosh/knex-paginate](https://github.com/felixmosh/knex-paginate)

## License

Knex-Nest is [MIT licensed](LICENSE).
