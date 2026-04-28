import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  health() {
    return {
      service: 'auth-service',
      status: this.dataSource.isInitialized ? 'ok' : 'degraded',
      postgres: this.dataSource.isInitialized,
      timestamp: new Date().toISOString(),
    };
  }
}
