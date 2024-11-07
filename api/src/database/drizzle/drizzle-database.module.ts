import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export const DATABASE_KEY = 'ARK_DATABASE';
export type AppDatabase = PostgresJsDatabase<typeof schema>;

@Module({
  imports: [
    DrizzlePostgresModule.registerAsync({
      tag: DATABASE_KEY,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        postgres: {
          url: configService.getOrThrow<string>('DATABASE_URL'),
        },
        config: {
          schema: { ...schema },
          logger: false,
        },
      }),
    }),
  ],
})
export class DrizzleDatabaseModule {}
