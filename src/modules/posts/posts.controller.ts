import {
  Controller,
  Get,
  Post,
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
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.options';
import { ImageValidationAndStoragePipe } from '../common/pipes/image-validation-and-storage.pipe';

@Controller('posts')
@UseGuards(AccessTokenGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('get-user-posts')
  getUserPosts(
    @UserId() userId: number,
    @Query('limit') limit = '10',
    @Query('offset') offset = '0',
    @Query('sort') sort: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.postsService.findUserPosts(userId, +limit, +offset, sort);
  }

  @Post('create-post')
  @UseInterceptors(FilesInterceptor('file', 10, multerOptions))
  createPost(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(createPostSchema)) body: CreatePostDto,
    @UploadedFiles(new ImageValidationAndStoragePipe('post-images')) files?: Express.Multer.File[],
  ) {
    return this.postsService.create(userId, body, files);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('file', 10, multerOptions))
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) body: UpdatePostDto,
    @UploadedFiles(new ImageValidationAndStoragePipe('post-images')) files?: Express.Multer.File[],
  ) {
    return this.postsService.update(+id, body, files);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postsService.delete(+id);
  }
}