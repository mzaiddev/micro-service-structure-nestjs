import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { Role } from '@app/common';
import { JwtPayload, JwtTokenService } from '@app/auth';

import { LoginCommandDto } from '../dto/login-command.dto';
import { RegisterCommandDto } from '../dto/register-command.dto';
import { AuthUserEntity } from '../entities/auth-user.entity';

@Injectable()
export class AuthDomainService {
  constructor(
    @InjectRepository(AuthUserEntity)
    private readonly authUserRepository: Repository<AuthUserEntity>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(dto: RegisterCommandDto) {
    const existingUser = await this.authUserRepository.findOne({ where: { email: dto.email } });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const authUser = this.authUserRepository.create({
      email: dto.email,
      passwordHash,
      roles: [Role.USER],
    });

    const savedUser = await this.authUserRepository.save(authUser);
    return this.buildAuthResponse(savedUser);
  }

  async login(dto: LoginCommandDto) {
    const authUser = await this.authUserRepository.findOne({ where: { email: dto.email } });

    if (!authUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, authUser.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    authUser.lastLoginAt = new Date();
    await this.authUserRepository.save(authUser);

    return this.buildAuthResponse(authUser);
  }

  async verifyAccessToken(token: string) {
    return this.jwtTokenService.verifyAccessToken(token);
  }

  async getUserById(userId: string) {
    const authUser = await this.authUserRepository.findOne({ where: { id: userId } });

    if (!authUser) {
      throw new NotFoundException('Auth user not found');
    }

    return this.sanitizeUser(authUser);
  }

  private async buildAuthResponse(authUser: AuthUserEntity) {
    const payload: JwtPayload = {
      sub: authUser.id,
      email: authUser.email,
      roles: authUser.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokenService.signAccessToken(payload),
      this.jwtTokenService.signRefreshToken(payload),
    ]);

    return {
      user: this.sanitizeUser(authUser),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  private sanitizeUser(authUser: AuthUserEntity) {
    return {
      id: authUser.id,
      email: authUser.email,
      roles: authUser.roles,
      lastLoginAt: authUser.lastLoginAt,
      createdAt: authUser.createdAt,
      updatedAt: authUser.updatedAt,
    };
  }
}
