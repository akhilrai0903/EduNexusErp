import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Student } from './student.entity';
import { User } from '../../auth/entities/user.entity';
import { GuardianType } from '../enums/guardian-type.enum';
import { Relationship } from '../enums/relationship.enum';

@Entity('student_guardians')
export class StudentGuardian extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare studentId: string;

  @Column({ type: 'uuid', nullable: true })
  declare userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  alternatePhone: string;

  @Column({
    type: 'enum',
    enum: GuardianType,
    default: GuardianType.PARENT,
  })
  type: GuardianType;

  @Column({
    type: 'enum',
    enum: Relationship,
  })
  relationship: Relationship;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  workplace: string;

  @Column({ nullable: true })
  workAddress: string;

  @Column({ nullable: true })
  workPhone: string;

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

  @Column({ default: false })
  isEmergencyContact: boolean;

  @Column({ default: false })
  isAuthorizedPickup: boolean;

  @Column({ default: false })
  canReceiveCommunications: boolean;

  @Column({ type: 'json', nullable: true })
  preferences: {
    communicationMethod?: string;
    language?: string;
    receiveSMS?: boolean;
    receiveEmail?: boolean;
    receiveWhatsApp?: boolean;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyIncome: number;

  @Column({ type: 'json', nullable: true })
  additionalInfo: Record<string, any>;

  @ManyToOne(() => Student, (student) => student.guardians)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
