import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { multerOptions } from '../../lib/multer/multer.options';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ImageValidationAndStoragePipe } from '../common/pipes/image-validation-and-storage.pipe';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UserId } from '../common/user-id.decorator';

import { UpdateUserDto, updateUserSchema } from './dto/update-user.schema';
import { UserResponseDto } from './dto/user-response.schema';
import { UsersService } from './users.service';

@Controller('profile')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getProfile(@UserId() userId: number): Promise<UserResponseDto> {
    return this.usersService.findById(userId);
  }

  @Patch()
  updateProfile(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(userId, body);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadAvatar(
    @UserId() userId: number,
    @UploadedFile(new ImageValidationAndStoragePipe('avatars'))
    file: Express.Multer.File,
  ): Promise<UserResponseDto> {
    return this.usersService.updateAvatar(userId, file.filename);
  }
}
