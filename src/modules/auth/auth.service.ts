import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Config } from '../../config/config.types';
import { getConfig } from '../../utils/get-config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { RefreshSession } from './entities/refresh-session.entity';

@Injectable()
export class AuthService {
  private config: Config;

  constructor(
    private jwt: JwtService,
    @InjectRepository(RefreshSession)
    private refreshRepo: Repository<RefreshSession>,
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    this.config = getConfig(configService);
  }

  async createUser(data: RegisterDto): Promise<User> {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.usersService.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  generateTokens(userId: number) {
    const accessToken = this.jwt.sign(
      { sub: userId },
      {
        secret: this.config.jwtAccessSecret,
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwt.sign(
      { sub: userId },
      {
        secret: this.config.jwtRefreshSecret,
        expiresIn: '30d',
      },
    );

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(
    userId: number,
    refreshToken: string,
    fingerprint: string,
  ) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = this.getRefreshExpirationDate();

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
  ) {
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

  async removeRefreshToken(userId: number, refreshToken: string) {
    const sessions = await this.refreshRepo.find({
      where: { userId },
    });

    for (const session of sessions) {
      const match = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );
      if (match) {
        await this.refreshRepo.delete(session.id);
        break;
      }
    }
  }

  private getRefreshExpirationDate(): Date {
    const days = 30;
    const ms = days * 24 * 60 * 60 * 1000;
    return new Date(Date.now() + ms);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
}
