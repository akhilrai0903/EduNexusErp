import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Exam } from './exam.entity';
import { ClassSection } from '../../academics/entities/class-section.entity';

@Entity('exam_schedules')
export class ExamSchedule extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare examId: string;

  @Column({ type: 'uuid' })
  declare sectionId: string;

  @Column({ type: 'date' })
  examDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ nullable: true })
  venue: string;

  @Column({ nullable: true })
  invigilator: string;

  @Column({ type: 'json', nullable: true })
  additionalInstructions: string[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Exam, (exam) => exam.schedules)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @ManyToOne(() => ClassSection)
  @JoinColumn({ name: 'sectionId' })
  section: ClassSection;
}
