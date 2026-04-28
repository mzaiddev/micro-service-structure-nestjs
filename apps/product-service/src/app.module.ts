import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisCacheModule } from '@app/cache';
import { AppConfigModule } from '@app/config';
import { createPostgresOptions } from '@app/database';
import { LoggerModule } from '@app/logger';

import { HealthController } from './controllers/health.controller';
import { ProductMessageController } from './controllers/product-message.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductDomainService } from './services/product-domain.service';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    LoggerModule,
    RedisCacheModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createPostgresOptions(configService, 'PRODUCT_DB_NAME', [ProductEntity]),
    }),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductMessageController, HealthController],
  providers: [ProductDomainService],
})
export class AppModule {}
