import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { User } from '../../auth/entities/user.entity';
import { Department } from './department.entity';
import { StaffStatus } from '../enums/staff-status.enum';
import { EmploymentType } from '../enums/employment-type.enum';
import { StaffDocument } from './staff-document.entity';
import { StaffLeave } from './staff-leave.entity';
import { StaffSalary } from './staff-salary.entity';

@Entity('staff')
export class Staff extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare userId: string;

  @Column({ unique: true })
  employeeId: string;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ type: 'date', nullable: true })
  leavingDate: Date;

  @Column({
    type: 'enum',
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status: StaffStatus;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ type: 'uuid', nullable: true })
  declare departmentId: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  grossSalary: number;

  @Column({ type: 'json', nullable: true })
  allowances: {
    housing?: number;
    transport?: number;
    medical?: number;
    other?: number;
  };

  @Column({ type: 'json', nullable: true })
  deductions: {
    tax?: number;
    insurance?: number;
    providentFund?: number;
    other?: number;
  };

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankIFSCCode: string;

  @Column({ nullable: true })
  panNumber: string;

  @Column({ nullable: true })
  aadharNumber: string;

  @Column({ nullable: true })
  esiNumber: string;

  @Column({ nullable: true })
  pfNumber: string;

  @Column({ type: 'int', default: 0 })
  totalLeaves: number;

  @Column({ type: 'int', default: 0 })
  usedLeaves: number;

  @Column({ type: 'json', nullable: true })
  qualifications: {
    degree: string;
    institution: string;
    year: number;
    grade?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  experience: {
    organization: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  skills: string[];

  @Column({ type: 'json', nullable: true })
  certifications: {
    name: string;
    issuer: string;
    date: Date;
    expiryDate?: Date;
  }[];

  @Column({ type: 'json', nullable: true })
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  workSchedule: {
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
    breakDuration: number;
  };

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Department, (department) => department.staff)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(() => StaffDocument, (document) => document.staff)
  documents: StaffDocument[];

  @OneToMany(() => StaffLeave, (leave) => leave.staff)
  leaves: StaffLeave[];

  @OneToMany(() => StaffSalary, (salary) => salary.staff)
  salaries: StaffSalary[];
}
