import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { StudentFee } from './student-fee.entity';
import { Student } from '../../sis/entities/student.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('payments')
export class Payment extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare studentFeeId: string;

  @Column({ type: 'uuid' })
  declare studentId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  referenceNumber: string;

  @Column({ nullable: true })
  gatewayResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ type: 'json', nullable: true })
  gatewayDetails: {
    gateway: string;
    gatewayTransactionId?: string;
    gatewayResponse?: any;
    processingFee?: number;
  };

  @Column({ type: 'json', nullable: true })
  paymentBreakdown: {
    componentId: string;
    componentName: string;
    amount: number;
  }[];

  @Column({ nullable: true })
  receiptNumber: string;

  @Column({ type: 'json', nullable: true })
  receiptData: {
    fileName: string;
    filePath: string;
    generatedAt: Date;
  };

  @Column({ nullable: true })
  remarks: string;

  @Column({ type: 'uuid', nullable: true })
  processedBy: string;

  @Column({ type: 'json', nullable: true })
  auditTrail: {
    action: string;
    performedBy: string;
    timestamp: Date;
    details: string;
  }[];

  @ManyToOne(() => StudentFee, (studentFee) => studentFee.payments)
  @JoinColumn({ name: 'studentFeeId' })
  studentFee: StudentFee;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
