import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import * as schema from './database/drizzle/schema';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
