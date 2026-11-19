import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Role } from '../enums/role.enum';
import { UserProfile } from './user-profile.entity';
import { LoginSession } from './login-session.entity';

@ObjectType()
@Entity('users')
export class User extends TenantBaseEntity {
  @Field()
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Field()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Field()
  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true, select: false })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastLoginIp: string;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil: Date;

  @Column({ type: 'json', nullable: true })
  preferences: Record<string, any>;

  @OneToMany(() => UserProfile, (profile) => profile.user)
  profiles: UserProfile[];

  // For convenience - get the primary profile
  profile?: UserProfile;

  @OneToMany(() => LoginSession, (session) => session.user)
  sessions: LoginSession[];

  // Virtual field for checking if account is locked
  get isLocked(): boolean {
    return !!(this.lockedUntil && this.lockedUntil > new Date());
  }
}
