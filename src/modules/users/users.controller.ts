import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { GetUser } from '../common/get-user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { updateUserSchema, UpdateUserDto } from './dto/update-user.schema';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { join } from 'path';

@Controller('profile')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getProfile(@GetUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Patch()
  updateProfile(
    @GetUser() user: User,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, body);
  }

  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'avatars'),
        filename: (_req: Express.Request, file: Express.Multer.File, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          const name = basename(file.originalname, ext);
          const uniqueName = `${name}-${uniqueSuffix}${ext}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadAvatar(@GetUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(user.id, file.filename);
  }
}