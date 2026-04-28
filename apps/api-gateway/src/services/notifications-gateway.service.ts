import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { MESSAGE_PATTERNS, SERVICE_REGISTRY } from '@app/messaging';

import { SendNotificationDto } from '../dto/notifications/send-notification.dto';

@Injectable()
export class NotificationsGatewayService {
  constructor(
    @Inject(SERVICE_REGISTRY.NOTIFICATION.token)
    private readonly notificationClient: ClientProxy,
  ) {}

  async create(dto: SendNotificationDto) {
    return lastValueFrom(this.notificationClient.send(MESSAGE_PATTERNS.notifications.create, dto));
  }

  async listMine(userId: string) {
    return lastValueFrom(
      this.notificationClient.send(MESSAGE_PATTERNS.notifications.listByUser, { userId }),
    );
  }
}
