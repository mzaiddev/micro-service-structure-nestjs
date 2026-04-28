import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { JwtUser } from '@app/auth';
import { MESSAGE_PATTERNS, SERVICE_REGISTRY } from '@app/messaging';

import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';

@Injectable()
export class AuthGatewayService {
  constructor(
    @Inject(SERVICE_REGISTRY.AUTH.token) private readonly authClient: ClientProxy,
    @Inject(SERVICE_REGISTRY.USER.token) private readonly userClient: ClientProxy,
  ) {}

  async register(dto: RegisterDto) {
    const authResult = await lastValueFrom(
      this.authClient.send(MESSAGE_PATTERNS.auth.register, dto),
    );

    await lastValueFrom(
      this.userClient.send(MESSAGE_PATTERNS.users.upsertProfile, {
        authUserId: authResult.user.id,
        email: authResult.user.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      }),
    );

    return authResult;
  }

  async login(dto: LoginDto) {
    return lastValueFrom(this.authClient.send(MESSAGE_PATTERNS.auth.login, dto));
  }

  async me(user: JwtUser) {
    const profile = await lastValueFrom(
      this.userClient.send(MESSAGE_PATTERNS.users.getProfile, { authUserId: user.sub }),
    );

    return {
      identity: user,
      profile,
    };
  }
}
