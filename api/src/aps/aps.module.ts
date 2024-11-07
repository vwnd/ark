import { ModelsModule } from '@/models/models.module';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { ApsService } from './aps.service';
import { WorkItemProcessor } from './workitem.processor';
import { WorkitemQueueEventListener } from './workitem.queue-event-listener';
import { WorkItemService } from './workitem.service';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'revit-workitem',
    }),
    forwardRef(() => ModelsModule),
  ],
  providers: [
    ApsService,
    WorkItemService,
    WorkItemProcessor,
    WorkitemQueueEventListener,
  ],
  exports: [ApsService],
})
export class ApsModule {}
