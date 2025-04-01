import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { CreatePostDto } from './dto/create-post.schema';
import { UpdatePostDto } from './dto/update-post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostImage) private imageRepo: Repository<PostImage>,
  ) {}

  async findAll(limit: number, offset: number, sort: 'ASC' | 'DESC') {
    return this.postRepo.find({
      order: { createdAt: sort },
      skip: offset,
      take: limit,
      relations: ['user', 'images'],
    });
  }

  async create(userId: number, dto: CreatePostDto, images: Express.Multer.File[]) {
    const post = this.postRepo.create({
      text: dto.text,
      user: { id: userId },
    });
    await this.postRepo.save(post);

    if (images?.length) {
      const imageEntities = images.map(file =>
        this.imageRepo.create({ filename: file.filename, post }),
      );
      await this.imageRepo.save(imageEntities);
    }

    return this.postRepo.findOne({ where: { id: post.id }, relations: ['images', 'user'] });
  }

  async update(id: number, dto: UpdatePostDto, files: Express.Multer.File[]) {
    const post = await this.postRepo.findOne({ where: { id }, relations: ['images'] });
    if (!post) throw new NotFoundException('Post not found');

    if (dto.text) post.text = dto.text;
    await this.postRepo.save(post);

    if (dto.deleteImageIds?.length) {
      await this.imageRepo.delete(dto.deleteImageIds);
    }

    if (files?.length) {
      const newImages = files.map(file => this.imageRepo.create({ filename: file.filename, post }));
      await this.imageRepo.save(newImages);
    }

    return this.postRepo.findOne({ where: { id }, relations: ['images', 'user'] });
  }

  async delete(id: number) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    await this.postRepo.remove(post);
    return { message: 'Post deleted' };
  }
}