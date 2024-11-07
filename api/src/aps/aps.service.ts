import { AuthenticationClient } from '@aps_sdk/authentication';
import { SdkManager, SdkManagerBuilder } from '@aps_sdk/autodesk-sdkmanager';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { WorkItemData } from './interfaces/workitem-data.interface';
import { WorkItemService } from './workitem.service';

@Injectable()
export class ApsService {
  private readonly logger = new Logger(ApsService.name);

  private readonly sdkManager: SdkManager;
  private readonly authClient: AuthenticationClient;
  private readonly APS_CLIENT_ID: string;
  private readonly APS_CLIENT_SECRET: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly workItemService: WorkItemService,
  ) {
    this.sdkManager = SdkManagerBuilder.create().build();
    this.authClient = new AuthenticationClient({ sdkManager: this.sdkManager });

    this.APS_CLIENT_ID = this.configService.getOrThrow<string>('APS_CLIENT_ID');
    this.APS_CLIENT_SECRET =
      this.configService.getOrThrow<string>('APS_CLIENT_SECRET');
  }

  async getTwoLeggedToken(): Promise<string> {
    try {
      const clientId = process.env.APS_CLIENT_ID!;
      const clientSecret = process.env.APS_CLIENT_SECRET!;

      const response = await this.authClient.getTwoLeggedToken(
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

      const token = response.access_token;

      if (!token) {
        throw new UnauthorizedException(
          'Failed to authenticate with Autodesk Platform Services.',
        );
      }

      return token;
    } catch (error) {
      this.logger.error('Failed to get two-legged token.', error);
      throw new InternalServerErrorException(
        'Failed to authenticate with Autodesk Platform Services.',
      );
    }
  }

  async publishModel(modelURL: string, modelId: string) {
    const accessToken = await this.getTwoLeggedToken();

    const activity = {
      activityId: 'Ark.ArkActivity+test',
      arguments: {
        rvtFile: {
          url: modelURL,
          verb: 'get',
        },
      },
    };

    const { data }: { data: WorkItemData } = await firstValueFrom(
      this.httpService
        .post<any>(
          'https://developer.api.autodesk.com/da/us-east/v3/workitems',
          JSON.stringify(activity),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error('Failed to publish model.', error.response?.data);
            throw new InternalServerErrorException(
              'Failed to publish model.',
              error.message,
            );
          }),
        ),
    );

    this.workItemService.createWorkItemJob(data.id, accessToken, modelId);

    return true;
  }
}
