import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;

  private readonly bucketName = 'ark-file-storage';

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
      region: this.configService.getOrThrow<string>('S3_REGION'),
    });
  }

  async getSignedURL(key: string, operation: 'get' | 'put' = 'get') {
    let command: GetObjectCommand | PutObjectCommand;

    switch (operation) {
      case 'get':
        command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        break;
      case 'put':
        command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        break;
      default:
        command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        break;
    }

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return url;
  }

  async isFileStored(key: string): Promise<boolean> {
    try {
      const response = await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      console.log('content-type', response.ContentType);
      console.log('content-length', response.ContentLength);
      console.log('last-modified', response.LastModified);

      return true;
    } catch (error) {
      return false;
    }
  }
}
