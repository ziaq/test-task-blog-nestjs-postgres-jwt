import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { deleteUploadedFile } from '../../utils/delete-uploaded-file';

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
      relations: ['images'],
    });

    return postsResponseSchema.parse(posts);
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

    const postWithImages = await this.postRepo.findOneOrFail({
      where: { id: post.id },
      relations: ['images'],
    });

    return postResponseSchema.parse(postWithImages);
  }

  private async deleteImagesByIds(ids: number[]) {
    const images = await this.imageRepo.findBy({ id: In(ids) });
    const filenames = images.map((img) => img.filename);
    filenames.forEach((name) => deleteUploadedFile('post-images', name));
    await this.imageRepo.delete(ids);
  }

  async update(
    id: number,
    dto: UpdatePostDto,
    files?: Express.Multer.File[],
  ): Promise<PostResponseDto> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!post) throw new NotFoundException('Post not found');

    if (dto.text && dto.text !== post.text) {
      post.text = dto.text;
      await this.postRepo.save(post);
    }

    if (dto.deleteImageIds?.length) {
      await this.deleteImagesByIds(dto.deleteImageIds);
    }

    if (files?.length) {
      await this.imageRepo.save(
        files.map((file) => ({ filename: file.filename, post })),
      );
    }

    const updatedPost = await this.postRepo.findOne({
      where: { id: post.id },
      relations: ['images'],
    });

    return postResponseSchema.parse(updatedPost);
  }

  async delete(id: number): Promise<void> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!post) throw new NotFoundException('Post not found');

    const imageIds = post.images?.map((img) => img.id) ?? [];
    if (imageIds.length > 0) {
      await this.deleteImagesByIds(imageIds);
    }

    await this.postRepo.remove(post);
  }
}
