import {
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserId } from '../common/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateUserSchema, UpdateUserDto } from './dto/update-user.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ImageValidationAndStoragePipe } from '../common/pipes/image-validation-and-storage.pipe';
import { multerOptions } from '../../config/multer.options';

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

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadAvatar(
    @UserId() userId: number,
    @UploadedFile(new ImageValidationAndStoragePipe('avatars')) file: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(userId, file.filename);
  }
}