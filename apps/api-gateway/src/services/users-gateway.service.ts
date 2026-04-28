import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { MESSAGE_PATTERNS, SERVICE_REGISTRY } from '@app/messaging';

@Injectable()
export class UsersGatewayService {
  constructor(@Inject(SERVICE_REGISTRY.USER.token) private readonly userClient: ClientProxy) {}

  async listProfiles() {
    return lastValueFrom(this.userClient.send(MESSAGE_PATTERNS.users.listProfiles, {}));
  }
}
