import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisCacheModule } from '@app/cache';
import { AppConfigModule } from '@app/config';
import { createPostgresOptions } from '@app/database';
import { LoggerModule } from '@app/logger';
import { registerRmqClients } from '@app/messaging';

import { HealthController } from './controllers/health.controller';
import { OrderMessageController } from './controllers/order-message.controller';
import { OrderEntity } from './entities/order.entity';
import { OrderDomainService } from './services/order-domain.service';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    LoggerModule,
    RedisCacheModule,
    registerRmqClients(['PRODUCT', 'NOTIFICATION']),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createPostgresOptions(configService, 'ORDER_DB_NAME', [OrderEntity]),
    }),
    TypeOrmModule.forFeature([OrderEntity]),
  ],
  controllers: [OrderMessageController, HealthController],
  providers: [OrderDomainService],
})
export class AppModule {}
