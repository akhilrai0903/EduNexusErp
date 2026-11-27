import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Hostel } from './hostel.entity';
import { HostelRoom } from './hostel-room.entity';
import { Student } from '../../sis/entities/student.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { AllocationStatus } from '../enums/allocation-status.enum';

@Entity('hostel_allocations')
export class HostelAllocation extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare hostelId: string;

  @Column({ type: 'uuid' })
  declare roomId: string;

  @Column({ type: 'uuid', nullable: true })
  declare studentId: string;

  @Column({ type: 'uuid', nullable: true })
  declare staffId: string;

  @Column({ type: 'date' })
  allocationDate: Date;

  @Column({ type: 'date', nullable: true })
  deallocationDate: Date;

  @Column({
    type: 'enum',
    enum: AllocationStatus,
    default: AllocationStatus.ACTIVE,
  })
  status: AllocationStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyRent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  securityDeposit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingAmount: number;

  @Column({ nullable: true })
  allocatedBy: string; // Staff member who allocated

  @Column({ nullable: true })
  deallocatedBy: string; // Staff member who deallocated

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  paymentHistory: {
    date: Date;
    amount: number;
    method: string;
    reference: string;
  }[];

  @Column({ type: 'json', nullable: true })
  maintenanceRequests: {
    date: Date;
    issue: string;
    status: string;
    resolution?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  violations: {
    date: Date;
    type: string;
    description: string;
    penalty: number;
    resolved: boolean;
  }[];

  @ManyToOne(() => Hostel, (hostel) => hostel.rooms)
  @JoinColumn({ name: 'hostelId' })
  hostel: Hostel;

  @ManyToOne(() => HostelRoom, (room) => room.allocations)
  @JoinColumn({ name: 'roomId' })
  room: HostelRoom;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}
