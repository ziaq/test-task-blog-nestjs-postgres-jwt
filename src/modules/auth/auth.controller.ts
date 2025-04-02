import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UserId } from '../common/user-id.decorator';

import { LoginDto, loginSchema } from './dto/login.dto';
import { RefreshTokenDto, refreshTokenSchema } from './dto/refresh-token.dto';
import { RegisterDto, registerSchema } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ReqWithCookie } from './types/req-with-cookie.type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterDto,
  ) {
    const user = await this.authService.createUser(body);
    return { id: user.id, email: user.email };
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password, fingerprint } = body;

    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = this.authService.generateTokens(
      user.id,
    );

    await this.authService.storeRefreshToken(
      user.id,
      refreshToken,
      fingerprint,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return { accessToken };
  }

  @Post('logout')
  async logout(
    @UserId() userId: number,
    @Req() req: ReqWithCookie,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    await this.authService.removeRefreshToken(userId, refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto,
  ) {
    const { accessToken, refreshToken } =
      this.authService.generateTokens(userId);
    await this.authService.storeRefreshToken(
      userId,
      refreshToken,
      body.fingerprint,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return { accessToken };
  }
}
