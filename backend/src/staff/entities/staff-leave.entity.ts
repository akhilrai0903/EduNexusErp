import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Staff } from './staff.entity';
import { LeaveType } from '../enums/leave-type.enum';
import { LeaveStatus } from '../enums/leave-status.enum';

@Entity('staff_leaves')
export class StaffLeave extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare staffId: string;

  @Column({
    type: 'enum',
    enum: LeaveType,
  })
  type: LeaveType;

  @Column({
    type: 'enum',
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'int' })
  totalDays: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  comments: string;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  approvalComments: string;

  @Column({ type: 'uuid', nullable: true })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ default: false })
  isEmergency: boolean;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    filePath: string;
    mimeType: string;
  }[];

  @Column({ type: 'json', nullable: true })
  coveringStaff: {
    staffId: string;
    responsibilities: string[];
  }[];

  @ManyToOne(() => Staff, (staff) => staff.leaves)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}
