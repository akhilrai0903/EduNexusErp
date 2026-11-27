import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Hostel } from './hostel.entity';
import { HostelAllocation } from './hostel-allocation.entity';
import { RoomType } from '../enums/room-type.enum';
import { RoomStatus } from '../enums/room-status.enum';

@Entity('hostel_rooms')
export class HostelRoom extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare hostelId: string;

  @Column()
  roomNumber: string;

  @Column({ nullable: true })
  floor: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.SINGLE,
  })
  type: RoomType;

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  currentOccupancy: number;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyRent: number;

  @Column({ type: 'json', nullable: true })
  facilities: string[];

  @Column({ type: 'json', nullable: true })
  furniture: {
    item: string;
    quantity: number;
    condition: string;
  }[];

  @Column({ type: 'json', nullable: true })
  amenities: {
    name: string;
    working: boolean;
    notes?: string;
  }[];

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  maintenanceHistory: {
    date: Date;
    issue: string;
    resolution: string;
    cost: number;
    performedBy: string;
  }[];

  @Column({ type: 'json', nullable: true })
  images: string[];

  @ManyToOne(() => Hostel, (hostel) => hostel.rooms)
  @JoinColumn({ name: 'hostelId' })
  hostel: Hostel;

  @OneToMany(() => HostelAllocation, (allocation) => allocation.room)
  allocations: HostelAllocation[];
}
