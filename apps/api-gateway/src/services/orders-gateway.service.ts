import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { MESSAGE_PATTERNS, SERVICE_REGISTRY } from '@app/messaging';

import { CreateOrderDto } from '../dto/orders/create-order.dto';

@Injectable()
export class OrdersGatewayService {
  constructor(@Inject(SERVICE_REGISTRY.ORDER.token) private readonly orderClient: ClientProxy) {}

  async create(userId: string, dto: CreateOrderDto) {
    return lastValueFrom(
      this.orderClient.send(MESSAGE_PATTERNS.orders.create, {
        userId,
        ...dto,
      }),
    );
  }

  async listMine(userId: string) {
    return lastValueFrom(this.orderClient.send(MESSAGE_PATTERNS.orders.listByUser, { userId }));
  }
}
