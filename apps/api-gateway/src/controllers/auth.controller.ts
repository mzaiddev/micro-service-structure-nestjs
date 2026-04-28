import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser, Public } from '@app/common';
import { JwtAuthGuard, JwtUser } from '@app/auth';

import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { AuthGatewayService } from '../services/auth-gateway.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authGatewayService: AuthGatewayService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authGatewayService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authGatewayService.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.authGatewayService.me(user);
  }
}
