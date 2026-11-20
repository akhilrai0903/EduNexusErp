import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Tenant } from './tenant.entity';
import { AcademicYear } from '../../academics/entities/academic-year.entity';

@Entity('schools')
export class School extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare tenantId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortName: string;

  @Column({ nullable: true })
  motto: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  principalName: string;

  @Column({ nullable: true })
  principalEmail: string;

  @Column({ nullable: true })
  principalPhone: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ type: 'date', nullable: true })
  establishedDate: Date;

  @Column({ type: 'json', nullable: true })
  academicSettings: {
    gradingSystem?: string;
    attendanceThreshold?: number;
    maxAbsenceDays?: number;
    examWeightage?: Record<string, number>;
  };

  @Column({ type: 'json', nullable: true })
  feeSettings: {
    currency?: string;
    lateFeePercentage?: number;
    gracePeriod?: number;
    installmentCount?: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.schools)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => AcademicYear, (academicYear) => academicYear.school)
  academicYears: AcademicYear[];
}
