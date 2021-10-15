import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KnexModule } from '@mithleshjs/knex-nest';

@Module({
  imports: [
    KnexModule.register({
      config: {
        client: 'mysql2',
        connection: {
          host: 'localhost',
          port: 3306,
          user: 'db_user',
          password: 'db_pass',
          database: 'db_name',
          ssl: { rejectUnauthorized: false },
        },
      },
      enablePaginator: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
