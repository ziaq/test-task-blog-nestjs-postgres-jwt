import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './post.entity';

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  post: Post;
}
