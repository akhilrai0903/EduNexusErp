import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { FeeStructure } from './fee-structure.entity';
import { FeeType } from '../enums/fee-type.enum';
import { PaymentFrequency } from '../enums/payment-frequency.enum';

@Entity('fee_components')
export class FeeComponent extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare feeStructureId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FeeType,
  })
  type: FeeType;

  @Column({
    type: 'enum',
    enum: PaymentFrequency,
    default: PaymentFrequency.ANNUAL,
  })
  frequency: PaymentFrequency;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ default: true })
  isMandatory: boolean;

  @Column({ default: false })
  isRefundable: boolean;

  @Column({ default: false })
  isWaivable: boolean;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  lateFeeStartDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  lateFeePercentage: number;

  @Column({ type: 'json', nullable: true })
  conditions: {
    minMarks?: number;
    attendancePercentage?: number;
    parentIncome?: number;
    scholarshipEligible?: boolean;
  };

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => FeeStructure, (feeStructure) => feeStructure.components)
  @JoinColumn({ name: 'feeStructureId' })
  feeStructure: FeeStructure;
}
