import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { AcademicYear } from '../../academics/entities/academic-year.entity';
import { Class } from '../../academics/entities/class.entity';
import { FeeComponent } from './fee-component.entity';

@Entity('fee_structures')
export class FeeStructure extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare academicYearId: string;

  @Column({ type: 'uuid' })
  declare classId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  settings: {
    allowInstallments?: boolean;
    installmentCount?: number;
    lateFeePercentage?: number;
    gracePeriod?: number; // days
    refundPolicy?: string;
  };

  @ManyToOne(() => AcademicYear)
  @JoinColumn({ name: 'academicYearId' })
  academicYear: AcademicYear;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @OneToMany(() => FeeComponent, (component) => component.feeStructure)
  components: FeeComponent[];
}
