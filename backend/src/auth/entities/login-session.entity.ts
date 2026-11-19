import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { User } from './user.entity';

@Entity('login_sessions')
export class LoginSession extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare userId: string;

  @Column({ unique: true })
  sessionToken: string;

  @Column({ unique: true })
  token: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  deviceType: string;

  @Column({ nullable: true })
  browser: string;

  @Column({ nullable: true })
  os: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp' })
  loginAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  logoutAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt: Date;

  @Column({ type: 'json', nullable: true })
  location: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;
}
