import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { getConfig } from '../../../utils/get-config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { RefreshRequest } from '../types/refresh-req.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    const config = getConfig(configService);

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.refreshToken as string | null,
      ]),
      secretOrKey: config.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: RefreshRequest,
    payload: JwtPayload,
  ): Promise<JwtPayload> {
    const refreshToken = req.cookies?.refreshToken;
    const fingerprint = req.body.fingerprint;

    if (!refreshToken || !fingerprint) {
      throw new UnauthorizedException('Invalid session');
    }

    const session = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken,
      fingerprint,
    );
    if (!session) throw new UnauthorizedException('Invalid session');

    return payload as unknown as JwtPayload;
  }
}
