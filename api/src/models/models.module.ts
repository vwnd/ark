import { ApsModule } from '@/aps/aps.module';
import { ProjectsModule } from '@/projects/projects.module';
import { StorageModule } from '@/storage/storage.module';
import { forwardRef, Module } from '@nestjs/common';
import { ModelsResolver } from './models.resolver';
import { ModelsService } from './services/models.service';

@Module({
  imports: [ProjectsModule, StorageModule, forwardRef(() => ApsModule)],
  providers: [ModelsService, ModelsResolver],
  exports: [ModelsService],
})
export class ModelsModule {}
