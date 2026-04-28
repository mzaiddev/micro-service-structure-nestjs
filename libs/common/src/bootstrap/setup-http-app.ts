import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import type { INestApplication } from '@nestjs/common';

import { AppLoggerService } from '@app/logger';

import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import type { ServiceBootstrapOptions } from '../interfaces/service-bootstrap-options.interface';

export function setupHttpApp(
  app: INestApplication,
  options: ServiceBootstrapOptions,
): void {
  const logger = app.get(AppLoggerService);

  app.useLogger(logger);
  app.use(helmet());
  app.use(compression());
  app.enableCors({ origin: true, credentials: true });
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix(options.globalPrefix ?? 'api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  if (options.swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(options.appName)
      .setDescription(options.serviceDescription ?? `${options.appName} API surface`)
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(options.swaggerPath ?? 'docs', app, document);
  }
}
