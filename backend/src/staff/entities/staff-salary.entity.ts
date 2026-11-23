import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Staff } from './staff.entity';

@Entity('staff_salaries')
export class StaffSalary extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare staffId: string;

  @Column({ type: 'date' })
  payPeriodStart: Date;

  @Column({ type: 'date' })
  payPeriodEnd: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  allowances: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  overtime: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonuses: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deductions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grossSalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netSalary: number;

  @Column({ type: 'json', nullable: true })
  salaryBreakdown: {
    component: string;
    amount: number;
    type: 'earning' | 'deduction';
  }[];

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  transactionReference: string;

  @Column({ type: 'json', nullable: true })
  payslipData: {
    fileName: string;
    filePath: string;
    generatedAt: Date;
  };

  @Column({ type: 'json', nullable: true })
  notes: string;

  @ManyToOne(() => Staff, (staff) => staff.salaries)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}
