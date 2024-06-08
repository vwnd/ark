import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { SdkManagerBuilder } from '@aps_sdk/autodesk-sdkmanager';
import { OssClient } from '@aps_sdk/oss';
import { ApsService } from 'src/aps/aps.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/drizzle/schema';
import { eq } from 'drizzle-orm';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class DocumentsService {
  logger = new Logger(DocumentsService.name);
  sdkManager = SdkManagerBuilder.create().build();
  ossClient = new OssClient(this.sdkManager);

  bucketkey = '<bucketkey>';
  filepath = '<path/to/file>';
  filename = '<filename>';
  access_token = '<token>';
  newObjName = '<filename>';
  hash = '<hash>';

  constructor(
    private readonly apsService: ApsService,
    private readonly storageService: StorageService,
    @Inject('DATABASE')
    private readonly drizzle: PostgresJsDatabase<typeof schema>,
  ) {}

  async uploadDocument(file: Express.Multer.File) {
    // create document in db

    // file.originalname will have extension, slice the string to get it
    const extension = file.originalname.slice(
      file.originalname.lastIndexOf('.') + 1,
    );

    if (!extension || !['rvt', '3dm'].includes(extension))
      throw new ForbiddenException('Invalid file type');

    const projectId = 2;

    const document = (
      await this.drizzle
        .insert(schema.documents)
        .values({
          projectId,
          name: file.originalname,
          type: extension,
        })
        .returning()
    )[0];

    this.logger.debug(document);

    let urn;
    if (extension === 'rvt') {
      urn = await this.uploadRevit(file, `${projectId}/${document.id}`);
    } else if (extension === '3dm') {
      urn = await this.uploadRhino(file, `${projectId}/${document.id}`);
    }
    await this.drizzle
      .update(schema.documents)
      .set({ urn })
      .where(eq(schema.documents.id, document.id));
  }

  async findAll() {
    return this.drizzle.query.documents.findMany();
  }

  private async uploadRhino(file, key): Promise<string> {
    return this.storageService.uploadFile(file.buffer, key, file.mimetype);
  }

  private async uploadRevit(file, key) {
    return this.apsService.uploadFile(key, file);
  }
}
