import fs from 'node:fs';
import path from 'node:path';

const [, , rawName, rawQueue = 'postgres'] = process.argv;

if (!rawName) {
  console.error('Usage: npm run service:scaffold -- <service-name> [postgres|mongo|none]');
  process.exit(1);
}

const repoRoot = process.cwd();
const serviceName = rawName.endsWith('-service') ? rawName : `${rawName}-service`;
const appRoot = path.join(repoRoot, 'apps', serviceName);
const srcRoot = path.join(appRoot, 'src');
const className = serviceName
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')
  .replace(/Service$/, 'ServiceApp');

fs.mkdirSync(path.join(srcRoot, 'controllers'), { recursive: true });
fs.mkdirSync(path.join(srcRoot, 'services'), { recursive: true });

const tsconfig = `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/apps/${serviceName}"
  },
  "include": [
    "src/**/*.ts"
  ]
}
`;

const appModule = `import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/config';
import { LoggerModule } from '@app/logger';

import { HealthController } from './controllers/health.controller';
import { DomainService } from './services/domain.service';

@Module({
  imports: [AppConfigModule.forRoot(), LoggerModule],
  controllers: [HealthController],
  providers: [DomainService],
})
export class AppModule {}
`;

const healthController = `import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  @Get()
  health() {
    return {
      service: '${serviceName}',
      status: 'ok',
      storageProfile: '${rawQueue}',
      timestamp: new Date().toISOString(),
    };
  }
}
`;

const domainService = `import { Injectable } from '@nestjs/common';

@Injectable()
export class DomainService {}
`;

const mainFile = `import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { setupHttpApp } from '@app/common';
import { AppLoggerService } from '@app/logger';
import { createRmqOptions } from '@app/messaging';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const port = Number(configService.get('${serviceName.toUpperCase().replace(/-/g, '_')}_PORT') ?? 0);

  setupHttpApp(app, {
    appName: '${className}',
    port,
    globalPrefix: configService.get('GLOBAL_PREFIX') ?? 'api',
    swaggerEnabled: configService.get('SWAGGER_ENABLED') !== 'false',
    swaggerPath: 'docs',
    serviceDescription: '${serviceName} scaffold generated from the shared platform template.',
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: createRmqOptions(configService, 'AUTH'),
  });

  await app.startAllMicroservices();
  await app.listen(port);
  app.get(AppLoggerService).log('${serviceName} listening on ' + port, 'Bootstrap');
}

void bootstrap();
`;

fs.writeFileSync(path.join(appRoot, 'tsconfig.app.json'), tsconfig);
fs.writeFileSync(path.join(srcRoot, 'app.module.ts'), appModule);
fs.writeFileSync(path.join(srcRoot, 'main.ts'), mainFile);
fs.writeFileSync(path.join(srcRoot, 'controllers', 'health.controller.ts'), healthController);
fs.writeFileSync(path.join(srcRoot, 'services', 'domain.service.ts'), domainService);

const nestCliPath = path.join(repoRoot, 'nest-cli.json');
const nestCli = JSON.parse(fs.readFileSync(nestCliPath, 'utf8'));

nestCli.projects[serviceName] = {
  type: 'application',
  root: `apps/${serviceName}`,
  entryFile: 'main',
  sourceRoot: `apps/${serviceName}/src`,
  compilerOptions: {
    tsConfigPath: `apps/${serviceName}/tsconfig.app.json`,
  },
};

fs.writeFileSync(nestCliPath, JSON.stringify(nestCli, null, 2) + '\n');
console.log(`Scaffolded ${serviceName}. Update queue bindings and environment variables before starting it.`);
