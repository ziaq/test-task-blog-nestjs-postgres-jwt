import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserResponseDto } from '../users/dto/user-response.schema';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AppConfigService } from '../../config/app-config.service';
import { Config } from '../../config/config.types';

import { RegisterDto } from './dto/register.schema';
import { RefreshSession } from './entities/refresh-session.entity';
import { getRefreshTokenExpiration } from './utils/get-refresh-token-expiration';

@Injectable()
export class AuthService {
  private config: Config;

  constructor(
    private jwt: JwtService,
    @InjectRepository(RefreshSession)
    private refreshRepo: Repository<RefreshSession>,
    private usersService: UsersService,
    appConfigService: AppConfigService
  ) {
    this.config = appConfigService.getConfig();
  }

  async registerUser(data: RegisterDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const sanitizedUser = await this.usersService.createUser({
      ...data,
      password: hashedPassword,
    });

    return sanitizedUser;
  }

  async generateTokens(
    userId: number,
    fingerprint: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwt.sign(
      { sub: userId },
      {
        secret: this.config.jwtAccessSecret,
        expiresIn: '30m',
      },
    );

    const refreshToken = this.jwt.sign(
      { sub: userId },
      {
        secret: this.config.jwtRefreshSecret,
        expiresIn: '30d',
      },
    );

    await this.storeRefreshToken(userId, refreshToken, fingerprint);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(
    userId: number,
    refreshToken: string,
    fingerprint: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = getRefreshTokenExpiration();

    await this.refreshRepo.delete({ userId, fingerprint });

    const session = this.refreshRepo.create({
      userId,
      refreshTokenHash: hash,
      fingerprint,
      expiresAt,
    });

    await this.refreshRepo.save(session);
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
    fingerprint: string,
  ): Promise<RefreshSession | null> {
    const sessions = await this.refreshRepo.find({
      where: { userId, fingerprint },
    });

    for (const session of sessions) {
      const match = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );
      if (match && session.expiresAt > new Date()) {
        return session;
      }
    }

    return null;
  }

  async removeRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const sessions = await this.refreshRepo.find({ where: { userId } });

    for (const session of sessions) {
      const match = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );
      if (match) {
        await this.refreshRepo.delete(session.id);
        return;
      }
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
}
