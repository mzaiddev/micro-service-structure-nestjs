import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser, Role, Roles } from '@app/common';
import { JwtAuthGuard, JwtUser, RolesGuard } from '@app/auth';

import { SendNotificationDto } from '../dto/notifications/send-notification.dto';
import { NotificationsGatewayService } from '../services/notifications-gateway.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly notificationsGatewayService: NotificationsGatewayService) {}

  @Get('me')
  listMine(@CurrentUser() user: JwtUser) {
    return this.notificationsGatewayService.listMine(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPPORT)
  @Post()
  create(@Body() dto: SendNotificationDto) {
    return this.notificationsGatewayService.create(dto);
  }
}
