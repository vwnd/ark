import { Module } from '@nestjs/common';
import { DeliverablesController } from './deliverables.controller';
import { DeliverablesService } from './deliverables.service';

@Module({
  controllers: [DeliverablesController],
  providers: [DeliverablesService]
})
export class DeliverablesModule {}
