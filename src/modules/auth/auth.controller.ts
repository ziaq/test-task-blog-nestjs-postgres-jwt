import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { loginSchema, LoginDto } from './dto/login.dto';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { registerSchema, RegisterDto } from './dto/register.dto';
import { RefreshTokenDto, refreshTokenSchema } from './dto/refresh-token.dto';
import { UserId } from '../common/user-id.decorator';
 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(new ZodValidationPipe(registerSchema)) body: RegisterDto) {
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
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const { accessToken, refreshToken } = await this.authService.generateTokens(user.id);
  
    await this.authService.storeRefreshToken(user.id, refreshToken, fingerprint);
  
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
  
    return { accessToken };
  }  

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(userId);
    await this.authService.storeRefreshToken(userId, refreshToken, body.fingerprint);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return { accessToken };
  }
}