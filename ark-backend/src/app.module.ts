import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';

@Module({
  imports: [
    DrizzlePostgresModule.register({
      tag: 'DB_DEV',
      postgres: {
        url: 'postgres://ark:ark@localhost:5432/ark',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
