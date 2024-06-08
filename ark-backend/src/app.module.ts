import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { DocumentsModule } from './documents/documents.module';
import { ApsModule } from './aps/aps.module';
import * as schema from './database/drizzle/schema';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    DrizzlePostgresModule.register({
      tag: 'DATABASE',
      postgres: {
        url: 'postgres://username:password@localhost:5432/ark',
      },
      config: {
        schema: { ...schema },
      },
    }),
    DocumentsModule,
    ApsModule,
    MulterModule.register(),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
