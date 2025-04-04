import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.save(data);

    const { password: _, ...safeUser } = user;
    return userResponseSchema.parse(safeUser);
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const { password: _, ...safeUser } = user;
    return userResponseSchema.parse(safeUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  async updateAvatar(id: number, filename: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.avatar) deleteUploadedFile('avatars', user.avatar);

    user.avatar = filename;
    const updatedUser = await this.userRepo.save(user);

    const { password: _, ...safeUser } = updatedUser;
    return userResponseSchema.parse(safeUser);
  }
}
