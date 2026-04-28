import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './configuration';
import { envValidationSchema } from './env.validation';

@Module({})
export class AppConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          expandVariables: true,
          load: [configuration],
          validationSchema: envValidationSchema,
        }),
      ],
      exports: [ConfigModule],
    };
  }
}
