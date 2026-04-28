import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisCacheModule } from '@app/cache';
import { AppConfigModule } from '@app/config';
import { createPostgresOptions } from '@app/database';
import { LoggerModule } from '@app/logger';

import { HealthController } from './controllers/health.controller';
import { UserMessageController } from './controllers/user-message.controller';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserDomainService } from './services/user-domain.service';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    LoggerModule,
    RedisCacheModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createPostgresOptions(configService, 'USER_DB_NAME', [UserProfileEntity]),
    }),
    TypeOrmModule.forFeature([UserProfileEntity]),
  ],
  controllers: [UserMessageController, HealthController],
  providers: [UserDomainService],
})
export class AppModule {}
