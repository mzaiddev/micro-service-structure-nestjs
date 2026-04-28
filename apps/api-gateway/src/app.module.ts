import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppAuthModule } from '@app/auth';
import { RedisCacheModule } from '@app/cache';
import { AppConfigModule } from '@app/config';
import { LoggerModule } from '@app/logger';
import { registerRmqClients } from '@app/messaging';

import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { OrdersController } from './controllers/orders.controller';
import { ProductsController } from './controllers/products.controller';
import { UsersController } from './controllers/users.controller';
import { AuthGatewayService } from './services/auth-gateway.service';
import { NotificationsGatewayService } from './services/notifications-gateway.service';
import { OrdersGatewayService } from './services/orders-gateway.service';
import { ProductsGatewayService } from './services/products-gateway.service';
import { UsersGatewayService } from './services/users-gateway.service';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    LoggerModule,
    AppAuthModule,
    RedisCacheModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: (configService.get<number>('RATE_LIMIT_TTL') ?? 60) * 1000,
          limit: configService.get<number>('RATE_LIMIT_LIMIT') ?? 100,
        },
      ],
    }),
    registerRmqClients(['AUTH', 'USER', 'PRODUCT', 'ORDER', 'NOTIFICATION']),
  ],
  controllers: [
    AuthController,
    UsersController,
    ProductsController,
    OrdersController,
    NotificationsController,
    HealthController,
  ],
  providers: [
    AuthGatewayService,
    UsersGatewayService,
    ProductsGatewayService,
    OrdersGatewayService,
    NotificationsGatewayService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
