import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UserId } from '../common/user-id.decorator';
import { UserResponseDto } from '../users/dto/user-response.schema';

import {
  AccessTokenResponseDto,
  accessTokenResponseSchema,
} from './dto/access-token-response.schema';
import { LoginDto, loginSchema } from './dto/login.schema';
import {
  LogoutResponseDto,
  logoutResponseSchema,
} from './dto/logout-response.schema';
import {
  RefreshTokenDto,
  refreshTokenSchema,
} from './dto/refresh-token.schema';
import { RegisterDto, registerSchema } from './dto/register.schema';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ReqWithCookie } from './types/req-with-cookie.type';
import { AuthService } from './auth.service';
import { getRefreshTokenExpiration } from './utils/get-refresh-token-expiration';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterDto,
  ): Promise<UserResponseDto> {
    const user = await this.authService.registerUser(body);
    return user;
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenResponseDto> {
    const { email, password, fingerprint } = body;

    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { 
      accessToken, 
      refreshToken, 
    } = await this.authService.generateTokens(user.id, fingerprint);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: getRefreshTokenExpiration(),
    });

    return accessTokenResponseSchema.parse({ accessToken });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(
    @UserId() userId: number,
    @Req() req: ReqWithCookie,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    await this.authService.removeRefreshToken(userId, refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return logoutResponseSchema.parse({
      message: 'Logged out successfully',
    });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto,
  ): Promise<AccessTokenResponseDto> {
    const { 
      accessToken, 
      refreshToken 
    } = await this.authService.generateTokens(userId, body.fingerprint);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: getRefreshTokenExpiration(),
    });

    return { accessToken };
  }
}
