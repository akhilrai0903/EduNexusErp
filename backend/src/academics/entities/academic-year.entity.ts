import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { School } from '../../tenancy/entities/school.entity';
import { Class } from './class.entity';

@Entity('academic_years')
export class AcademicYear extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare schoolId: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  terms: {
    name: string;
    startDate: Date;
    endDate: Date;
    weightage: number;
  }[];

  @Column({ type: 'json', nullable: true })
  holidays: {
    name: string;
    date: Date;
    type: string;
  }[];

  @Column({ type: 'json', nullable: true })
  settings: {
    gradingSystem?: string;
    attendanceThreshold?: number;
    maxAbsenceDays?: number;
    workingDays?: number;
  };

  @ManyToOne(() => School, (school) => school.academicYears)
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @OneToMany(() => Class, (cls) => cls.academicYear)
  classes: Class[];
}
