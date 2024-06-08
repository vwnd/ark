import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string = 'ark-file-storage';

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
      },
      region: this.configService.getOrThrow('S3_REGION'),
    });
  }

  async uploadFile(buffer: Buffer, name: string, mimeType: string) {
    this.logger.debug(
      `FILE: ${name}, MIME: ${mimeType}, SIZE: ${buffer.length}`,
    );
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: name,
          Body: buffer,
          ContentType: mimeType,
        }),
      );

      return name;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
