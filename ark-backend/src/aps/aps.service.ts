import { SdkManager, SdkManagerBuilder } from '@aps_sdk/autodesk-sdkmanager';
import { AuthenticationClient } from '@aps_sdk/authentication';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OssClient } from '@aps_sdk/oss';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ApsService {
  sdkManager: SdkManager;
  authenticationClient: AuthenticationClient;
  ossClient: OssClient;

  bucketkey = 'ark-storage';

  logger = new Logger(ApsService.name);
  constructor(private readonly configService: ConfigService) {
    this.sdkManager = SdkManagerBuilder.create().build();
    this.authenticationClient = new AuthenticationClient(this.sdkManager);
    this.ossClient = new OssClient(this.sdkManager);
  }

  async getTwoLeggedToken() {
    const clientId = this.configService.getOrThrow('APS_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow('APS_CLIENT_SECRET');

    const response = await this.authenticationClient.getTwoLeggedToken(
      clientId,
      clientSecret,
      [
        'bucket:create',
        'bucket:read',
        'data:create',
        'data:write',
        'data:read',
      ],
    );

    this.logger.debug(response.access_token);

    const token = response.access_token;

    if (!token) {
      throw new BadRequestException('Failed to get access token');
    }

    return token;
  }

  async uploadFile(objectKey: string, file: Express.Multer.File) {
    // save file to tmp folder
    const randomTmpKey = Math.random().toString(36).substring(7);
    const tempFilePath = path.join(process.cwd(), 'tmp', randomTmpKey);
    fs.writeFileSync(tempFilePath, file.buffer);

    try {
      const access_token = await this.getTwoLeggedToken();
      this.logger.debug(file.path);
      this.logger.debug(file.destination);
      const response = await this.ossClient.upload(
        this.bucketkey,
        objectKey,
        tempFilePath,
        access_token,
      );
      this.logger.debug(response);
      return response.objectId;
    } catch (error) {
    } finally {
      fs.unlinkSync(tempFilePath);
    }
  }
}
