import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigModule } from '@app/config';
import { createMongoOptions } from '@app/database';
import { LoggerModule } from '@app/logger';

import { HealthController } from './controllers/health.controller';
import { NotificationMessageController } from './controllers/notification-message.controller';
import { NotificationDomainService } from './services/notification-domain.service';
import { Notification, NotificationSchema } from './schemas/notification.schema';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    LoggerModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createMongoOptions(configService, 'NOTIFICATION_MONGO_DB'),
    }),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [NotificationMessageController, HealthController],
  providers: [NotificationDomainService],
})
export class AppModule {}
