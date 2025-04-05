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
import {
  GetUserPostsQueryDto,
  getUserPostsQuerySchema,
} from './dto/get-user-posts.query.schema';
import { PostIdParamDto, postIdParamSchema } from './dto/post-id.param.schema';
import { PostResponseDto } from './dto/post-response.schema';
import { PostsResponseDto } from './dto/posts-response.schema';
import { UpdatePostDto, updatePostSchema } from './dto/update-post.schema';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(AccessTokenGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('get-user-posts')
  getUserPosts(
    @UserId() userId: number,
    @Query(new ZodValidationPipe(getUserPostsQuerySchema))
    query: GetUserPostsQueryDto,
  ): Promise<PostsResponseDto> {
    return this.postsService.findUserPosts(userId, query);
  }

  @Post('create-post')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('file', 10, multerOptions))
  createPost(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(createPostSchema)) body: CreatePostDto,
    @UploadedFiles(new ImageValidationAndStoragePipe('post-images'))
    files?: Express.Multer.File[],
  ): Promise<PostResponseDto> {
    return this.postsService.create(userId, body, files);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('file', 10, multerOptions))
  update(
    @Param(new ZodValidationPipe(postIdParamSchema)) params: PostIdParamDto,
    @Body(new ZodValidationPipe(updatePostSchema)) body: UpdatePostDto,
    @UploadedFiles(new ImageValidationAndStoragePipe('post-images'))
    files?: Express.Multer.File[],
  ): Promise<PostResponseDto> {
    return this.postsService.update(params.id, body, files);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(
    @Param(new ZodValidationPipe(postIdParamSchema)) params: PostIdParamDto,
  ) {
    return this.postsService.delete(params.id);
  }
}
