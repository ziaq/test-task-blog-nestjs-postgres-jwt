import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_sessions')
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  refreshTokenHash: string;

  @Column()
  fingerprint: string;

  @Column()
  expiresAt: Date;
}
