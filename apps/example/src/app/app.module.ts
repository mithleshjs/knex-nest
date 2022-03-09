import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KnexModule } from '@mithleshjs/knex-nest';
import { AppService } from './app.service';

@Module({
  imports: [
    KnexModule.register({
      configTag: 'mysql',
      config: {
        client: 'mysql2',
        connection: {
          host: process.env.DB_MYSQL_HOST || 'localhost',
          port: parseInt(process.env.DB_MYSQL_POST) || 3306,
          user: process.env.DB_MYSQL_USER || 'root',
          password: process.env.DB_MYSQL_PASSWORD || '',
          database: process.env.DB_MYSQL_DATABASE || 'your_database',
          ssl: { rejectUnauthorized: false },
        },
      },
    }),
    KnexModule.registerAsync({
      configTag: 'postgres',
      useFactory: async () => ({
        config: {
          client: 'pg',
          connection: await process.env.DB_POSTGRES_URL,
          searchPath: ['musicbrainz'],
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
