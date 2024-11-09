import { ApsService } from '@/aps/aps.service';
import { DATABASE_KEY } from '@/database/database.module';
import { ProjectsService } from '@/projects/projects.service';
import { StorageService } from '@/storage/storage.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import generateCursor from 'drizzle-cursor';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ModelCollection } from '../graphql/model-collection.type';
import { CreateModelInput } from '../graphql/type/create-model.input';
import { CreateModelOutput } from '../graphql/type/create-model.output';
import { ModelStatus } from '../graphql/type/model-status.enum';
import { ModelType } from '../graphql/type/model-type.enum';
import * as schema from '../persistence/models.schema';

@Injectable()
export class ModelsService {
  private readonly logger = new Logger(ModelsService.name);

  constructor(
    @Inject(DATABASE_KEY)
    private readonly db: PostgresJsDatabase<typeof schema>,

    private readonly projectsService: ProjectsService,

    private readonly storageService: StorageService,

    private readonly apsService: ApsService,
  ) {}

  async createModel(
    input: CreateModelInput,
    userId: string,
  ): Promise<CreateModelOutput> {
    const { name, projectId, modelType } = input;

    await this.projectsService.findById(projectId, userId);

    const model = await this.db
      .insert(schema.models)
      .values({
        name,
        projectId,
        createdBy: userId,
        type: modelType,
        status: ModelStatus.UNPUBLISHED,
      })
      .returning();

    return model[0];
  }

  async getModelUploadURL(modelId: string, userId: string): Promise<string> {
    const result = await this.db
      .select({
        createdBy: schema.models.createdBy,
        id: schema.models.id,
        fileStorageKey: schema.models.fileStorageKey,
        type: schema.models.type,
      })
      .from(schema.models)
      .where(
        and(eq(schema.models.id, modelId), eq(schema.models.createdBy, userId)),
      )
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException('Model not found.');
    }

    const model = result[0];

    if (model.fileStorageKey) {
      const isModelUploaded = await this.storageService.isFileStored(
        model.fileStorageKey,
      );
      if (isModelUploaded) {
        throw new BadRequestException('Model already uploaded.');
      } else {
        return await this.storageService.getSignedURL(
          model.fileStorageKey,
          'get',
        );
      }
    }

    let fileExtension: string;
    switch (model.type) {
      case ModelType.REVIT:
        fileExtension = 'rvt';
        break;
      case ModelType.RHINO:
        fileExtension = '3dm';
        break;
      default:
        throw new BadRequestException('Invalid file type.');
    }

    const randomFileName = randomBytes(16).toString('hex');

    const key = `models/${model.id}/${randomFileName}.${fileExtension}`;

    const url = await this.storageService.getSignedURL(key, 'put');

    await this.db
      .update(schema.models)
      .set({ fileStorageKey: key, updatedAt: new Date() })
      .where(eq(schema.models.id, modelId));

    return url;
  }

  async publishModel(modelId: string, userId: string): Promise<boolean> {
    const result = await this.db
      .select({
        createdBy: schema.models.createdBy,
        id: schema.models.id,
        fileStorageKey: schema.models.fileStorageKey,
        modelType: schema.models.type,
      })
      .from(schema.models)
      .where(
        and(eq(schema.models.id, modelId), eq(schema.models.createdBy, userId)),
      )
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException('Model not found.');
    }

    const model = result[0];

    if (!model.fileStorageKey) {
      throw new BadRequestException('Model not uploaded.');
    }

    if (model.fileStorageKey) {
      const isModelUploaded = await this.storageService.isFileStored(
        model.fileStorageKey,
      );
      if (!isModelUploaded)
        throw new BadRequestException('Model not uploaded.');
    }

    const modelPresignedURL = await this.storageService.getSignedURL(
      model.fileStorageKey,
      'get',
    );

    switch (model.modelType) {
      case ModelType.REVIT:
        await this.apsService.publishModel(modelPresignedURL, modelId);
        break;
      case ModelType.RHINO:
        throw new NotImplementedException(
          'Rhino model publishing not implemented.',
        );
        break;
      default:
        throw new BadRequestException('Invalid file type.');
    }

    await this.db
      .update(schema.models)
      .set({ status: ModelStatus.PENDING, updatedAt: new Date() })
      .where(eq(schema.models.id, modelId));

    return true;
  }

  async updateModelStatus(modelId: string, status: ModelStatus) {
    try {
      await this.db
        .update(schema.models)
        .set({ status, updatedAt: new Date() })
        .where(eq(schema.models.id, modelId));
    } catch (error) {
      this.logger.error('Failed to update model status.', error);
      throw new InternalServerErrorException('Failed to update model status.');
    }
  }

  async getProjectModels(projectId: string): Promise<ModelCollection> {
    const cursor = generateCursor({
      primaryCursor: {
        key: 'id',
        schema: schema.models.id,
      },
    });

    const models = await this.db
      .select()
      .from(schema.models)
      .where(and(cursor.where(), eq(schema.models.projectId, projectId)))
      .limit(20);

    return {
      cursor: cursor.serialize(models.at(-1)),
      items: models,
    };
  }
}
