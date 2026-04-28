import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { RedisService } from '@app/cache';
import { MESSAGE_PATTERNS, SERVICE_REGISTRY } from '@app/messaging';

import { CreateOrderCommandDto } from '../dto/create-order-command.dto';
import { OrderEntity } from '../entities/order.entity';

interface ProductSnapshot {
  id: string;
  name: string;
  price: number;
  currency: string;
  isActive: boolean;
}

@Injectable()
export class OrderDomainService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly redisService: RedisService,
    @Inject(SERVICE_REGISTRY.PRODUCT.token) private readonly productClient: ClientProxy,
    @Inject(SERVICE_REGISTRY.NOTIFICATION.token)
    private readonly notificationClient: ClientProxy,
  ) {}

  async create(dto: CreateOrderCommandDto) {
    const products = (await lastValueFrom(
      this.productClient.send(MESSAGE_PATTERNS.products.getByIds, {
        productIds: dto.items.map((item) => item.productId),
      }),
    )) as ProductSnapshot[];

    if (products.length !== dto.items.length) {
      throw new BadRequestException('One or more products were not found');
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product || !product.isActive) {
        throw new BadRequestException(`Product ${item.productId} is not available`);
      }

      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: Number(product.price),
      };
    });

    await lastValueFrom(
      this.productClient.send(MESSAGE_PATTERNS.products.reserveStock, {
        items: dto.items,
      }),
    );

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    );

    const order = this.orderRepository.create({
      userId: dto.userId,
      currency: dto.currency,
      totalAmount,
      status: 'created',
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);
    await this.redisService.del(`orders:${dto.userId}`);

    this.notificationClient.emit(MESSAGE_PATTERNS.notifications.orderCreated, {
      userId: dto.userId,
      orderId: savedOrder.id,
      totalAmount: savedOrder.totalAmount,
      currency: savedOrder.currency,
    });

    return savedOrder;
  }

  async listByUser(userId: string) {
    const cacheKey = `orders:${userId}`;
    const cachedOrders = await this.redisService.get<OrderEntity[]>(cacheKey);

    if (cachedOrders) {
      return cachedOrders;
    }

    const orders = await this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    await this.redisService.set(cacheKey, orders, 120);
    return orders;
  }
}
