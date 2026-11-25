import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { CbtQuestion } from './cbt-question.entity';
import { CbtAttempt } from './cbt-attempt.entity';
import { CbtStatus } from '../enums/cbt-status.enum';

@Entity('cbt_exams')
export class CbtExam extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare examId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CbtStatus,
    default: CbtStatus.DRAFT,
  })
  status: CbtStatus;

  @Column({ type: 'int' })
  duration: number; // in minutes

  @Column({ type: 'int' })
  totalQuestions: number;

  @Column({ type: 'int' })
  totalMarks: number;

  @Column({ type: 'int' })
  passMarks: number;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ default: false })
  allowMultipleAttempts: boolean;

  @Column({ type: 'int', default: 1 })
  maxAttempts: number;

  @Column({ default: false })
  shuffleQuestions: boolean;

  @Column({ default: false })
  shuffleOptions: boolean;

  @Column({ default: false })
  showCorrectAnswers: boolean;

  @Column({ default: false })
  showResultsImmediately: boolean;

  @Column({ type: 'json', nullable: true })
  accessControl: {
    allowedUsers?: string[];
    allowedClasses?: string[];
    allowedSections?: string[];
    ipRestrictions?: string[];
  };

  @Column({ type: 'json', nullable: true })
  settings: {
    allowCalculator?: boolean;
    allowDictionary?: boolean;
    allowFullscreen?: boolean;
    preventCopy?: boolean;
    preventPrint?: boolean;
    autoSubmit?: boolean;
    warningTime?: number; // minutes before auto-submit
  };

  @Column({ type: 'json', nullable: true })
  instructions: string[];

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @OneToMany(() => CbtQuestion, (question) => question.cbtExam)
  questions: CbtQuestion[];

  @OneToMany(() => CbtAttempt, (attempt) => attempt.cbtExam)
  attempts: CbtAttempt[];
}
