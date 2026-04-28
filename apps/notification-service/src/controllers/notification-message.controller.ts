import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { MESSAGE_PATTERNS } from '@app/messaging';

import { CreateNotificationCommandDto } from '../dto/create-notification-command.dto';
import { NotificationDomainService } from '../services/notification-domain.service';

@Controller()
export class NotificationMessageController {
  constructor(private readonly notificationDomainService: NotificationDomainService) {}

  @MessagePattern(MESSAGE_PATTERNS.notifications.create)
  create(@Payload() dto: CreateNotificationCommandDto) {
    return this.notificationDomainService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.notifications.listByUser)
  listByUser(@Payload() payload: { userId: string }) {
    return this.notificationDomainService.listByUser(payload.userId);
  }

  @EventPattern(MESSAGE_PATTERNS.notifications.orderCreated)
  handleOrderCreated(
    @Payload()
    payload: {
      userId: string;
      orderId: string;
      totalAmount: number;
      currency: string;
    },
  ) {
    return this.notificationDomainService.create({
      userId: payload.userId,
      type: 'order.created',
      title: 'Order confirmed',
      message: `Order ${payload.orderId} was created for ${payload.totalAmount} ${payload.currency}.`,
      payload,
      channel: 'in_app',
    });
  }
}
