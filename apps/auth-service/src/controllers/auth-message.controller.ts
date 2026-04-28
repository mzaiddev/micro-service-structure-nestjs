import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MESSAGE_PATTERNS } from '@app/messaging';

import { LoginCommandDto } from '../dto/login-command.dto';
import { RegisterCommandDto } from '../dto/register-command.dto';
import { AuthDomainService } from '../services/auth-domain.service';

@Controller()
export class AuthMessageController {
  constructor(private readonly authDomainService: AuthDomainService) {}

  @MessagePattern(MESSAGE_PATTERNS.auth.register)
  register(@Payload() dto: RegisterCommandDto) {
    return this.authDomainService.register(dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.login)
  login(@Payload() dto: LoginCommandDto) {
    return this.authDomainService.login(dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.verifyAccessToken)
  verifyAccessToken(@Payload() payload: { token: string }) {
    return this.authDomainService.verifyAccessToken(payload.token);
  }

  @MessagePattern(MESSAGE_PATTERNS.auth.getUserById)
  getUserById(@Payload() payload: { userId: string }) {
    return this.authDomainService.getUserById(payload.userId);
  }
}
