import {
  Controller,
  Get,
  Post as HttpPost,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PostsService } from './posts.service';
import { UserId } from '../common/user-id.decorator';
import { CreatePostDto, createPostSchema } from './dto/create-post.schema';
import { UpdatePostDto, updatePostSchema } from './dto/update-post.schema';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { join } from 'path';

@Controller('posts')
@UseGuards(AccessTokenGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getAll(
    @Query('limit') limit = '10',
    @Query('offset') offset = '0',
    @Query('sort') sort: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.postsService.findAll(+limit, +offset, sort);
  }

  @HttpPost()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'post-images'),
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
  create(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(createPostSchema)) body: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.create(userId, body, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'post-images'),
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
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) body: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.update(+id, body, files);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postsService.delete(+id);
  }
}