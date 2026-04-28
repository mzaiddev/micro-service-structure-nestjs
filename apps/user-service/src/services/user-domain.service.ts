import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RedisService } from '@app/cache';

import { UpsertProfileCommandDto } from '../dto/upsert-profile-command.dto';
import { UserProfileEntity } from '../entities/user-profile.entity';

@Injectable()
export class UserDomainService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly redisService: RedisService,
  ) {}

  async upsertProfile(dto: UpsertProfileCommandDto) {
    const existingProfile = await this.userProfileRepository.findOne({
      where: { authUserId: dto.authUserId },
    });

    const profile = this.userProfileRepository.create({
      ...existingProfile,
      ...dto,
      status: existingProfile?.status ?? 'active',
    });

    const savedProfile = await this.userProfileRepository.save(profile);
    await this.redisService.set(`user-profile:${dto.authUserId}`, savedProfile, 300);

    return savedProfile;
  }

  async getProfile(authUserId: string) {
    const cachedProfile = await this.redisService.get<UserProfileEntity>(`user-profile:${authUserId}`);

    if (cachedProfile) {
      return cachedProfile;
    }

    const profile = await this.userProfileRepository.findOne({ where: { authUserId } });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.redisService.set(`user-profile:${authUserId}`, profile, 300);
    return profile;
  }

  async listProfiles() {
    return this.userProfileRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
