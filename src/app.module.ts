import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { Migrator } from '@mikro-orm/migrations';
import { LeadsModule } from './leads/leads.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({
      driver: SqliteDriver,
      dbName: process.env.DATABASE_PATH ?? 'database/leads.sqlite',
      metadataProvider: ReflectMetadataProvider,
      autoLoadEntities: true,
      forceUtcTimezone: true,
      extensions: [Migrator],
      migrations: {
        path: './migrations',
        glob: '!(*.d).{js,ts}',
        transactional: true,
        allOrNothing: true,
        snapshot: false,
      },
    }),
    LeadsModule,
    WebhooksModule,
  ],
})
export class AppModule {}
