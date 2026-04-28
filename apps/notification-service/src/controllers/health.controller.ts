import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  health() {
    return {
      service: 'notification-service',
      status: this.connection.readyState === 1 ? 'ok' : 'degraded',
      mongo: this.connection.readyState === 1,
      timestamp: new Date().toISOString(),
    };
  }
}
