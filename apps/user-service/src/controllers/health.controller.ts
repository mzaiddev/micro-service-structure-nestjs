import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

import { RedisService } from '@app/cache';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async health() {
    const redisStatus = (await this.redisService.ping()) === 'PONG';

    return {
      service: 'user-service',
      status: this.dataSource.isInitialized && redisStatus ? 'ok' : 'degraded',
      postgres: this.dataSource.isInitialized,
      redis: redisStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
