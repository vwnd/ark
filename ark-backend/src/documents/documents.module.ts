import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ApsModule } from 'src/aps/aps.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [ApsModule, StorageModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
