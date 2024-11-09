import { ApsModule } from '@/aps/aps.module';
import { ProjectsModule } from '@/projects/projects.module';
import { StorageModule } from '@/storage/storage.module';
import { forwardRef, Module } from '@nestjs/common';
import { ModelsService } from './core/models.service';
import { ModelsResolver } from './graphql/models.resolver';

@Module({
  imports: [ProjectsModule, StorageModule, forwardRef(() => ApsModule)],
  providers: [ModelsService, ModelsResolver],
  exports: [ModelsService],
})
export class ModelsModule {}
