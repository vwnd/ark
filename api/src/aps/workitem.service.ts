import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { WorkItemJobData } from './interfaces/workitem-job-data.interface';

@Injectable()
export class WorkItemService {
  constructor(
    @InjectQueue('revit-workitem')
    private revitWorkItemQueue: Queue<WorkItemJobData>,
  ) {}

  async createWorkItemJob(
    workItemId: string,
    accessToken: string,
    modelId: string,
  ) {
    await this.revitWorkItemQueue.add(
      'workitem',
      {
        workItemId,
        accessToken,
        modelId,
      },
      {
        attempts: 90,
        backoff: {
          type: 'fixed',
          delay: 10000, // 10 seconds
        },
      },
    );
  }

  async getWorkItemJob(
    jobId: string,
  ): Promise<Job<WorkItemJobData, any, string> | undefined> {
    const job = await this.revitWorkItemQueue.getJob(jobId);
    return job;
  }
}
