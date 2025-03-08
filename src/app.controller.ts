import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'Hello World' })
  @ApiOperation({ summary: 'Get Hello World' })
  getHello(): string {
    return this.appService.getHello();
  }
}
