import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppAuthModule } from '@app/auth';
import { AppConfigModule } from '@app/config';
import { createPostgresOptions } from '@app/database';
import { LoggerModule } from '@app/logger';

import { AuthMessageController } from './controllers/auth-message.controller';
import { HealthController } from './controllers/health.controller';
import { AuthUserEntity } from './entities/auth-user.entity';
import { AuthDomainService } from './services/auth-domain.service';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    LoggerModule,
    AppAuthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createPostgresOptions(configService, 'AUTH_DB_NAME', [AuthUserEntity]),
    }),
    TypeOrmModule.forFeature([AuthUserEntity]),
  ],
  controllers: [AuthMessageController, HealthController],
  providers: [AuthDomainService],
})
export class AppModule {}
