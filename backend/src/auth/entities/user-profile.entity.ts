import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { User } from './user.entity';
import { Gender } from '../enums/gender.enum';

@Entity('user_profiles')
export class UserProfile extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'json', nullable: true })
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  additionalInfo: Record<string, any>;

  @ManyToOne(() => User, (user) => user.profiles)
  @JoinColumn({ name: 'userId' })
  user: User;
}
