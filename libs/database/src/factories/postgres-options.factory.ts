import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export function createPostgresOptions(
  configService: ConfigService,
  databaseNameEnv: string,
  entities: EntityClassOrSchema[] = [],
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST') ?? process.env.POSTGRES_HOST,
    port: Number(configService.get<number>('POSTGRES_PORT') ?? process.env.POSTGRES_PORT ?? 5432),
    username: configService.get<string>('POSTGRES_USERNAME') ?? process.env.POSTGRES_USERNAME,
    password: configService.get<string>('POSTGRES_PASSWORD') ?? process.env.POSTGRES_PASSWORD,
    database: configService.get<string>(databaseNameEnv) ?? process.env[databaseNameEnv],
    autoLoadEntities: false,
    synchronize: true,
    entities,
    logging: false,
  };
}
