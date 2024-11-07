import { Module } from '@nestjs/common';
import { ProjectsModule } from '@/projects/projects.module';
import { GraphQLModule } from '@/graphql/graphql.module';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { StorageModule } from './storage/storage.module';
import { ApsModule } from './aps/aps.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphQLModule,
    ProjectsModule,
    UsersModule,
    AuthModule,
    ModelsModule,
    StorageModule,
    ApsModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
