import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Student } from '../../sis/entities/student.entity';
import { FeeStructure } from './fee-structure.entity';
import { Payment } from './payment.entity';
import { FeeStatus } from '../enums/fee-status.enum';

@Entity('student_fees')
export class StudentFee extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare studentId: string;

  @Column({ type: 'uuid' })
  declare feeStructureId: string;

  @Column({
    type: 'enum',
    enum: FeeStatus,
    default: FeeStatus.PENDING,
  })
  status: FeeStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lateFeeAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  waiverAmount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  lastPaymentDate: Date;

  @Column({ type: 'date', nullable: true })
  nextDueDate: Date;

  @Column({ default: false })
  allowInstallments: boolean;

  @Column({ type: 'int', default: 1 })
  installmentCount: number;

  @Column({ type: 'int', default: 0 })
  paidInstallments: number;

  @Column({ type: 'json', nullable: true })
  installmentSchedule: {
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    paidAmount: number;
    paidDate?: Date;
    status: string;
  }[];

  @Column({ type: 'json', nullable: true })
  feeBreakdown: {
    componentId: string;
    componentName: string;
    amount: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: Date;
  }[];

  @Column({ type: 'json', nullable: true })
  concessions: {
    type: string;
    amount: number;
    reason: string;
    approvedBy: string;
    approvedAt: Date;
  }[];

  @Column({ type: 'json', nullable: true })
  reminders: {
    sentAt: Date;
    type: string;
    recipient: string;
    status: string;
  }[];

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => FeeStructure)
  @JoinColumn({ name: 'feeStructureId' })
  feeStructure: FeeStructure;

  @OneToMany(() => Payment, (payment) => payment.studentFee)
  payments: Payment[];
}
