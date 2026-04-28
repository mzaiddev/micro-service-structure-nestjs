import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import type { MicroserviceOptions } from '@nestjs/microservices';

import { setupHttpApp } from '@app/common';
import { AppLoggerService } from '@app/logger';
import { createRmqOptions } from '@app/messaging';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const port = Number(configService.get<number>('USER_SERVICE_PORT') ?? 3002);

  setupHttpApp(app, {
    appName: 'User Service',
    port,
    globalPrefix: configService.get<string>('GLOBAL_PREFIX') ?? 'api',
    swaggerEnabled: configService.get<string>('SWAGGER_ENABLED') !== 'false',
    swaggerPath: 'docs',
    serviceDescription: 'User profile and user metadata service.',
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: createRmqOptions(configService, 'USER'),
  });

  await app.startAllMicroservices();
  await app.listen(port);
  app.get(AppLoggerService).log(`User Service listening on ${port}`, 'Bootstrap');
}

void bootstrap();
