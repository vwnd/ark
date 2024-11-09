import { ModelsService } from '@/models/core/models.service';
import { ModelStatus } from '@/models/graphql/type/model-status.enum';
import { HttpService } from '@nestjs/axios';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Job } from 'bullmq';
import { catchError, firstValueFrom } from 'rxjs';
import { WorkItemData } from './interfaces/workitem-data.interface';
import { WorkItemJobData } from './interfaces/workitem-job-data.interface';

@Processor('revit-workitem')
export class WorkItemProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkItemProcessor.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly modelsService: ModelsService,
  ) {
    super();
  }

  async process(job: Job<WorkItemJobData>): Promise<any> {
    this.logger.debug(`Processing work item ${job.data.workItemId}`);

    const { workItemId, accessToken, modelId } = job.data;

    const {
      data,
    }: {
      data: WorkItemData;
    } = await firstValueFrom(
      this.httpService
        .get(
          `https://developer.api.autodesk.com/da/us-east/v3/workitems/${workItemId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error('Failed to retrieve WorkItem data.', error);
            throw new InternalServerErrorException(
              'Failed to retrieve WorkItem data.',
            );
          }),
        ),
    );

    if (data.status === 'success') {
      this.logger.debug(`Work item ${workItemId} completed successfully.`);
      await this.modelsService.updateModelStatus(
        modelId,
        ModelStatus.PUBLISHED,
      );
      return true;
    }

    if (data.status === 'inprogress' || data.status === 'pending') {
      this.logger.debug(`Work item ${workItemId} is pending.`);
      throw new Error('Work item not completed');
    }

    this.logger.warn(
      `Work item ${workItemId} failed with status ${data.status}.`,
      JSON.stringify(data),
    );

    await this.modelsService.updateModelStatus(modelId, ModelStatus.FAILED);
    return false;
  }
}
