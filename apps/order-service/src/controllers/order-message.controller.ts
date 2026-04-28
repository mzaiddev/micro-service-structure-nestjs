import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MESSAGE_PATTERNS } from '@app/messaging';

import { CreateOrderCommandDto } from '../dto/create-order-command.dto';
import { OrderDomainService } from '../services/order-domain.service';

@Controller()
export class OrderMessageController {
  constructor(private readonly orderDomainService: OrderDomainService) {}

  @MessagePattern(MESSAGE_PATTERNS.orders.create)
  create(@Payload() dto: CreateOrderCommandDto) {
    return this.orderDomainService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.orders.listByUser)
  listByUser(@Payload() payload: { userId: string }) {
    return this.orderDomainService.listByUser(payload.userId);
  }
}
