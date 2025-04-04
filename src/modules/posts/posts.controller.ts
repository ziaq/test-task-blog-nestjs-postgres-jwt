import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { multerOptions } from '../../config/multer.options';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ImageValidationAndStoragePipe } from '../common/pipes/image-validation-and-storage.pipe';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UserId } from '../common/user-id.decorator';

import { CreatePostDto, createPostSchema } from './dto/create-post.schema';
import { UpdatePostDto, updatePostSchema } from './dto/update-post.schema';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.schema';
import { PostsResponseDto } from './dto/posts-response.schema';

@Controller('posts')
@UseGuards(AccessTokenGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('get-user-posts')
  getUserPosts(
    @UserId() userId: number,
    @Query('limit') limit = '10',
    @Query('offset') offset = '0',
    @Query('sort') sort: 'ASC' | 'DESC' = 'DESC'
  ): Promise<PostsResponseDto> {
    return this.postsService.findUserPosts(userId, +limit, +offset, sort);
  }

  @Post('create-post')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('file', 10, multerOptions))
  createPost(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(createPostSchema)) body: CreatePostDto,
    @UploadedFiles(new ImageValidationAndStoragePipe('post-images')) files?: Express.Multer.File[]
  ): Promise<PostResponseDto> {
    return this.postsService.create(userId, body, files);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('file', 10, multerOptions))
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) body: UpdatePostDto,
    @UploadedFiles(new ImageValidationAndStoragePipe('post-images'))
    files?: Express.Multer.File[],
  ): Promise<PostResponseDto> {
    return this.postsService.update(+id, body, files);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.postsService.delete(+id);
  }
}
