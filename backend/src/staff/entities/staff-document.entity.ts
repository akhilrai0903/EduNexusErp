import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Staff } from './staff.entity';
import { StaffDocumentType } from '../enums/staff-document-type.enum';

@Entity('staff_documents')
export class StaffDocument extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare staffId: string;

  @Column()
  name: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({
    type: 'enum',
    enum: StaffDocumentType,
  })
  type: StaffDocumentType;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  @Column({ nullable: true })
  verificationNotes: string;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Staff, (staff) => staff.documents)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}
