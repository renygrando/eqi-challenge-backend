import 'reflect-metadata';
import { defineConfig } from '@mikro-orm/sqlite';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  driver: SqliteDriver,
  dbName: process.env.DATABASE_PATH ?? 'database/leads.sqlite',
  metadataProvider: ReflectMetadataProvider,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  forceUtcTimezone: true,
  extensions: [Migrator],
  migrations: {
    path: './migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    snapshot: false,
  },
});
