import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MESSAGE_PATTERNS } from '@app/messaging';

import { UpsertProfileCommandDto } from '../dto/upsert-profile-command.dto';
import { UserDomainService } from '../services/user-domain.service';

@Controller()
export class UserMessageController {
  constructor(private readonly userDomainService: UserDomainService) {}

  @MessagePattern(MESSAGE_PATTERNS.users.upsertProfile)
  upsertProfile(@Payload() dto: UpsertProfileCommandDto) {
    return this.userDomainService.upsertProfile(dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.users.getProfile)
  getProfile(@Payload() payload: { authUserId: string }) {
    return this.userDomainService.getProfile(payload.authUserId);
  }

  @MessagePattern(MESSAGE_PATTERNS.users.listProfiles)
  listProfiles() {
    return this.userDomainService.listProfiles();
  }
}
