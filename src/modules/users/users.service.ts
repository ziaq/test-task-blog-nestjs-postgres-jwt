import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { deleteUploadedFile } from '../../utils/delete-uploaded-file';

import { CreateUserDto } from './dto/create-user.schema';
import { UpdateUserDto } from './dto/update-user.schema';
import {
  UserResponseDto,
  userResponseSchema,
} from './dto/user-response.schema';
import { User } from './entities/user.entity';
import { sanitizeUser } from './utils/sanitize-user';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userRepo.save(data);
    const sanitizedUser = sanitizeUser(user);
  
    return userResponseSchema.parse(sanitizedUser);
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ 
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthDate: true,
        about: true,
        avatar: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const sanitizedUser = sanitizeUser(user);
    
    return userResponseSchema.parse(sanitizedUser);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    if (dto.email) {
      const user = await this.findByEmail(dto.email);
      if (user && user.id !== id) throw new ConflictException('User with this email already exists');
    }
  
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async updateAvatar(id: number, filename: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.avatar) deleteUploadedFile('avatars', user.avatar);

    user.avatar = filename;

    const updatedUser = await this.userRepo.save(user);
    const sanitizedUpdatedUser = sanitizeUser(updatedUser);

    return userResponseSchema.parse(sanitizedUpdatedUser);
  }
}
