import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { SdkManagerBuilder } from '@aps_sdk/autodesk-sdkmanager';
import { OssClient } from '@aps_sdk/oss';
import { ApsService } from 'src/aps/aps.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/drizzle/schema';
import { eq } from 'drizzle-orm';

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

    const urn = await this.apsService.uploadFile(
      `${projectId}/${document.id}`,
      file,
    );
    await this.drizzle
      .update(schema.documents)
      .set({ urn })
      .where(eq(schema.documents.id, document.id));
  }

  create(createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  findAll() {
    return `This action returns all documents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
