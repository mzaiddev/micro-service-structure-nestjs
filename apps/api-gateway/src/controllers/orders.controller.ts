import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@app/common';
import { JwtAuthGuard, JwtUser } from '@app/auth';

import { CreateOrderDto } from '../dto/orders/create-order.dto';
import { OrdersGatewayService } from '../services/orders-gateway.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersGatewayService: OrdersGatewayService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateOrderDto) {
    return this.ordersGatewayService.create(user.sub, dto);
  }

  @Get('me')
  listMine(@CurrentUser() user: JwtUser) {
    return this.ordersGatewayService.listMine(user.sub);
  }
}
