import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserId } from '../common/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateUserSchema, UpdateUserDto } from './dto/update-user.schema';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { createMulterOptions } from '../../utils/create-multer-options';

@Controller('profile')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getProfile(@UserId() userId: number) {
    return this.usersService.findById(userId);
  }

  @Patch()
  updateProfile(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
  ) {
    return this.usersService.update(userId, body);
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file', createMulterOptions('avatars')))
  uploadAvatar(@UserId() userId: number, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File was not uploaded');
    return this.usersService.updateAvatar(userId, file.filename);
  }
}