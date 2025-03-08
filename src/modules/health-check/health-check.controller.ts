import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller({ path: 'health-check', version: VERSION_NEUTRAL })
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  checkMemoryUsage = async (): Promise<HealthIndicatorResult> => {
    const { heapTotal } = process.memoryUsage();
    return this.memory.checkHeap('memoryHeap', heapTotal);
  };

  @Get()
  @ApiOperation({ description: 'Check the health of the application' })
  @ApiOkResponse({ description: 'The application is healthy' })
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> => this.checkMemoryUsage(),
    ]);
  }
}
