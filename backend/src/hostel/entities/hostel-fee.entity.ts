import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Hostel } from './hostel.entity';
import { FeeType } from '../enums/fee-type.enum';

@Entity('hostel_fees')
export class HostelFee extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare hostelId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FeeType,
  })
  type: FeeType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  frequency: string; // monthly, quarterly, yearly, etc.

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ default: false })
  isMandatory: boolean;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'json', nullable: true })
  conditions: {
    roomType?: string[];
    allocationType?: string[];
    duration?: number;
  };

  @ManyToOne(() => Hostel, (hostel) => hostel.fees)
  @JoinColumn({ name: 'hostelId' })
  hostel: Hostel;
}
