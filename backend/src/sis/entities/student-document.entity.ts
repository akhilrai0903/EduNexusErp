import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Student } from './student.entity';
import { DocumentType } from '../enums/document-type.enum';

@Entity('student_documents')
export class StudentDocument extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare studentId: string;

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
    enum: DocumentType,
  })
  type: DocumentType;

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

  @ManyToOne(() => Student, (student) => student.documents)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
