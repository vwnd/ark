import { ModelStatus } from '@/models/enum/model-status.enum';
import { ModelsService } from '@/models/services/models.service';
import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { WorkItemService } from './workitem.service';

@QueueEventsListener('revit-workitem')
export class WorkitemQueueEventListener extends QueueEventsHost {
  private readonly logger = new Logger(WorkitemQueueEventListener.name);

  constructor(
    private readonly modelsService: ModelsService,
    private readonly workItemService: WorkItemService,
  ) {
    super();
  }

  @OnQueueEvent('retries-exhausted')
  async onRetriesExhausted(
    args: { jobId: string; attemptsMade: number },
    // id: string,
  ) {
    const { jobId } = args;
    this.logger.debug(`Retries exhausted for job ${jobId}`);

    const job = await this.workItemService.getWorkItemJob(jobId);

    if (!job) {
      this.logger.error(`Job ${jobId} not found`);
      return;
    }

    await this.modelsService.updateModelStatus(
      job.data.modelId,
      ModelStatus.FAILED,
    );
  }
}
