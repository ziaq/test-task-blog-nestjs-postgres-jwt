import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { deleteUploadedFile } from '../../lib/utils/delete-uploaded-file';

import { WITH_IMAGES, WITH_IMAGES_AND_USER } from './constants/relations.const';
import { CreatePostDto } from './dto/create-post.schema';
import { GetUserPostsQueryDto } from './dto/get-user-posts.query.schema';
import {
  PostResponseDto,
  postResponseSchema,
} from './dto/post-response.schema';
import {
  PostsResponseDto,
  postsResponseSchema,
} from './dto/posts-response.schema';
import { UpdatePostDto } from './dto/update-post.schema';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { omitUser } from './utils/omit-user';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostImage) private imageRepo: Repository<PostImage>,
  ) {}

  async findUserPosts(
    userId: number,
    query: GetUserPostsQueryDto,
  ): Promise<PostsResponseDto> {
    const { sort, offset, limit } = query;

    const posts = await this.postRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: sort },
      skip: offset,
      take: limit,
      relations: WITH_IMAGES,
    });

    const postsWithoutUser = omitUser(posts);

    return postsResponseSchema.parse(postsWithoutUser);
  }

  async create(
    userId: number,
    dto: CreatePostDto,
    images?: Express.Multer.File[],
  ): Promise<PostResponseDto> {
    const post = await this.postRepo.save({
      text: dto.text,
      user: { id: userId },
    });

    if (images?.length) {
      await this.imageRepo.save(
        images.map((file) => ({ filename: file.filename, post })),
      );
    }

    const newPost = await this.postRepo.findOneOrFail({
      where: { id: post.id },
      relations: WITH_IMAGES,
    });

    const newPostWithoutUser = omitUser(newPost);

    return postResponseSchema.parse(newPostWithoutUser);
  }

  private async deleteImagesByIds(
    postId: number,
    ids: number | number[],
  ): Promise<void> {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    const images = await this.imageRepo.find({
      where: { id: In(idsArray) },
      relations: ['post'],
    });

    const invalid = images.find((img) => img.post.id !== postId);
    if (invalid) {
      throw new ForbiddenException('Some images do not belong to this post');
    }

    const filenames = images.map((img) => img.filename);
    filenames.forEach((name) => deleteUploadedFile('post-images', name));
    await this.imageRepo.delete(idsArray);
  }

  async update(
    userId: number,
    id: number,
    dto: UpdatePostDto,
    files?: Express.Multer.File[],
  ): Promise<PostResponseDto> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: WITH_IMAGES_AND_USER,
    });
    if (!post) throw new NotFoundException('Post not found');

    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    if (dto.text && dto.text !== post.text) {
      post.text = dto.text;
      await this.postRepo.save(post);
    }

    if (dto.deleteImageIds) {
      await this.deleteImagesByIds(id, dto.deleteImageIds);
    }

    if (files?.length) {
      await this.imageRepo.save(
        files.map((file) => ({ filename: file.filename, post })),
      );
    }

    const updatedPost = await this.postRepo.findOne({
      where: { id: post.id },
      relations: WITH_IMAGES,
    });
    if (!updatedPost) throw new NotFoundException('Post not found');

    const updatedPostWithoutUser = omitUser(updatedPost);

    return postResponseSchema.parse(updatedPostWithoutUser);
  }

  async delete(userId: number, id: number): Promise<void> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: WITH_IMAGES_AND_USER,
    });
    if (!post) throw new NotFoundException('Post not found');

    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    const imageIds = post.images?.map((img) => img.id) ?? [];
    if (imageIds.length > 0) {
      await this.deleteImagesByIds(id, imageIds);
    }

    await this.postRepo.remove(post);
  }
}
