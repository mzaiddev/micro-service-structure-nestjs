import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { setupHttpApp } from '@app/common';
import { AppLoggerService } from '@app/logger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  setupHttpApp(app, {
    appName: 'API Gateway',
    port: Number(configService.get<number>('API_GATEWAY_PORT') ?? 3000),
    globalPrefix: configService.get<string>('GLOBAL_PREFIX') ?? 'api',
    swaggerEnabled: configService.get<string>('SWAGGER_ENABLED') !== 'false',
    swaggerPath: 'docs',
    serviceDescription: 'Public entry point for all platform domains.',
  });

  const port = Number(configService.get<number>('API_GATEWAY_PORT') ?? 3000);
  await app.listen(port);
  app.get(AppLoggerService).log(`API Gateway listening on ${port}`, 'Bootstrap');
}

void bootstrap();
