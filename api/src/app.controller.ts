import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      version: JSON.stringify(process.env['npm_package_version']),
    };
  }
}
