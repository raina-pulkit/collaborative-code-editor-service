import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { MemoryHealthIndicator } from '@nestjs/terminus';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  providers: [MemoryHealthIndicator],
  controllers: [HealthCheckController],
  imports: [TerminusModule],
})
export class HealthCheckModule {}
