import { Entity, Column, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { HostelRoom } from './hostel-room.entity';
import { HostelFee } from './hostel-fee.entity';
import { HostelStatus } from '../enums/hostel-status.enum';

@Entity('hostels')
export class Hostel extends TenantBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  contactNumber: string;

  @Column({ nullable: true })
  wardenName: string;

  @Column({ nullable: true })
  wardenContact: string;

  @Column({
    type: 'enum',
    enum: HostelStatus,
    default: HostelStatus.ACTIVE,
  })
  status: HostelStatus;

  @Column({ type: 'int', default: 0 })
  totalRooms: number;

  @Column({ type: 'int', default: 0 })
  totalCapacity: number;

  @Column({ type: 'int', default: 0 })
  currentOccupancy: number;

  @Column({ type: 'json', nullable: true })
  facilities: string[];

  @Column({ type: 'json', nullable: true })
  rules: string[];

  @Column({ type: 'json', nullable: true })
  amenities: {
    name: string;
    description: string;
    availability: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  mealPlan: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    price: number;
  };

  @Column({ type: 'json', nullable: true })
  visitingHours: {
    start: string;
    end: string;
    days: string[];
  };

  @Column({ type: 'json', nullable: true })
  curfewTimings: {
    weekdays: string;
    weekends: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  securityDeposit: number;

  @Column({ type: 'json', nullable: true })
  additionalFees: {
    name: string;
    amount: number;
    frequency: string;
  }[];

  @Column({ type: 'json', nullable: true })
  images: string[];

  @OneToMany(() => HostelRoom, (room) => room.hostel)
  rooms: HostelRoom[];

  @OneToMany(() => HostelFee, (fee) => fee.hostel)
  fees: HostelFee[];
}
