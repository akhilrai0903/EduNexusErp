import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Tenant } from './tenant.entity';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

@Entity('subscriptions')
export class Subscription extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare tenantId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ type: 'json', nullable: true })
  features: string[];

  @Column({ type: 'int', default: 0 })
  studentLimit: number;

  @Column({ type: 'int', default: 0 })
  staffLimit: number;

  @Column({ type: 'int', default: 0 })
  storageLimit: number; // in GB

  @Column({ type: 'timestamp', nullable: true })
  lastPaymentDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextPaymentDate: Date;

  @Column({ type: 'json', nullable: true })
  billingInfo: {
    billingCycle?: string;
    autoRenew?: boolean;
    paymentGateway?: string;
  };

  @ManyToOne(() => Tenant, (tenant) => tenant.subscriptions)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}
