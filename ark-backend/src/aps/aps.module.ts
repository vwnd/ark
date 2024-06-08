import { Module } from '@nestjs/common';
import { ApsService } from './aps.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [ApsService],
  exports: [ApsService],
})
export class ApsModule {}
