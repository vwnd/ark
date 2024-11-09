import { DatabaseModule } from '@/database/database.module';
import { ModelsModule } from '@/models/models.module';
import { forwardRef, Module } from '@nestjs/common';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => ModelsModule)],
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
