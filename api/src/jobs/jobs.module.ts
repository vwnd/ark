import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
          username:
            process.env.NODE_ENV === 'production' ? 'default' : undefined,
          password:
            process.env.NODE_ENV === 'production'
              ? configService.get('REDIS_PASSWORD')
              : undefined,
          tls: process.env.NODE_ENV === 'production' ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class JobsModule {}
