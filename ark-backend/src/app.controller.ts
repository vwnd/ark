import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('documents/create')
  documentCreate() {}

  @Get('projects')
  async projects() {
    return this.appService.projects();
  }
}
