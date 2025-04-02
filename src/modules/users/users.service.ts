import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { deleteUploadedFile } from '../../utils/delete-uploaded-file';

import { UpdateUserDto } from './dto/update-user.schema';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    birthDate?: Date;
    about?: string;
  }): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  async updateAvatar(
    id: number,
    filename: string,
  ): Promise<{ avatar: string }> {
    const user = await this.findById(id);

    if (user.avatar) deleteUploadedFile('avatars', user.avatar);

    await this.userRepo.update(id, { avatar: filename });
    return { avatar: filename };
  }
}
