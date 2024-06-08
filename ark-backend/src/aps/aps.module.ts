import { Module } from '@nestjs/common';
import { ApsService } from './aps.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ApsService],
  exports: [ApsService],
})
export class ApsModule {}
