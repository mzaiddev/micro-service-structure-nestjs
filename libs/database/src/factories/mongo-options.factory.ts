import type { ConfigService } from '@nestjs/config';
import type { MongooseModuleOptions } from '@nestjs/mongoose';

export function createMongoOptions(
  configService: ConfigService,
  databaseNameEnv: string,
): MongooseModuleOptions {
  return {
    uri: configService.get<string>('MONGO_URI') ?? process.env.MONGO_URI,
    dbName: configService.get<string>(databaseNameEnv) ?? process.env[databaseNameEnv],
  };
}
