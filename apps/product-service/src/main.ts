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
  const port = Number(configService.get<number>('PRODUCT_SERVICE_PORT') ?? 3003);

  setupHttpApp(app, {
    appName: 'Product Service',
    port,
    globalPrefix: configService.get<string>('GLOBAL_PREFIX') ?? 'api',
    swaggerEnabled: configService.get<string>('SWAGGER_ENABLED') !== 'false',
    swaggerPath: 'docs',
    serviceDescription: 'Catalog and inventory service.',
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: createRmqOptions(configService, 'PRODUCT'),
  });

  await app.startAllMicroservices();
  await app.listen(port);
  app.get(AppLoggerService).log(`Product Service listening on ${port}`, 'Bootstrap');
}

void bootstrap();
