import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Role, Roles } from '@app/common';
import { JwtAuthGuard, RolesGuard } from '@app/auth';

import { UsersGatewayService } from '../services/users-gateway.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersGatewayService: UsersGatewayService) {}

  @Roles(Role.ADMIN, Role.SUPPORT)
  @Get()
  listProfiles() {
    return this.usersGatewayService.listProfiles();
  }
}
