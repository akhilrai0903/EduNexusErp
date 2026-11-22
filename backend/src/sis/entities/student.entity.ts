import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { User } from '../../auth/entities/user.entity';
import { Class } from '../../academics/entities/class.entity';
import { StudentStatus } from '../enums/student-status.enum';
import { BloodGroup } from '../enums/blood-group.enum';
import { StudentGuardian } from './student-guardian.entity';
import { StudentDocument } from './student-document.entity';

@Entity('students')
export class Student extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare userId: string;

  @Column({ unique: true })
  admissionNumber: string;

  @Column({ type: 'date' })
  admissionDate: Date;

  @Column({ nullable: true })
  rollNumber: string;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @Column({ type: 'uuid', nullable: true })
  currentClassId: string;

  @Column({ type: 'uuid', nullable: true })
  currentSectionId: string;

  @Column({ nullable: true })
  previousSchool: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  placeOfBirth: string;

  @Column({
    type: 'enum',
    enum: BloodGroup,
    nullable: true,
  })
  bloodGroup: BloodGroup;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  religion: string;

  @Column({ nullable: true })
  caste: string;

  @Column({ nullable: true })
  motherTongue: string;

  @Column({ type: 'json', nullable: true })
  medicalInfo: {
    allergies?: string[];
    medications?: string[];
    medicalConditions?: string[];
    doctorName?: string;
    doctorPhone?: string;
    insuranceNumber?: string;
  };

  @Column({ type: 'json', nullable: true })
  academicHistory: {
    previousGrades?: Record<string, string>;
    achievements?: string[];
    disciplinaryActions?: string[];
  };

  @Column({ type: 'json', nullable: true })
  extracurricularActivities: {
    sports?: string[];
    clubs?: string[];
    competitions?: string[];
  };

  @Column({ default: false })
  isTransportRequired: boolean;

  @Column({ default: false })
  isHostelRequired: boolean;

  @Column({ default: false })
  isMealRequired: boolean;

  @Column({ type: 'json', nullable: true })
  specialNeeds: {
    learningDisabilities?: string[];
    physicalDisabilities?: string[];
    accommodations?: string[];
  };

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Class, (cls) => cls.students)
  @JoinColumn({ name: 'currentClassId' })
  currentClass: Class;

  @OneToMany(() => StudentGuardian, (guardian) => guardian.student)
  guardians: StudentGuardian[];

  @OneToMany(() => StudentDocument, (document) => document.student)
  documents: StudentDocument[];
}
