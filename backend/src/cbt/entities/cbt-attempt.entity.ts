import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { CbtExam } from './cbt-exam.entity';
import { Student } from '../../sis/entities/student.entity';
import { AttemptStatus } from '../enums/attempt-status.enum';

@Entity('cbt_attempts')
export class CbtAttempt extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare cbtExamId: string;

  @Column({ type: 'uuid' })
  declare studentId: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.IN_PROGRESS,
  })
  status: AttemptStatus;

  @Column({ type: 'json', nullable: true })
  answers: {
    questionId: string;
    answer: string | string[];
    timestamp: Date;
    isMarkedForReview: boolean;
  }[];

  @Column({ type: 'int', default: 0 })
  totalQuestions: number;

  @Column({ type: 'int', default: 0 })
  answeredQuestions: number;

  @Column({ type: 'int', default: 0 })
  markedForReview: number;

  @Column({ type: 'int', default: 0 })
  correctAnswers: number;

  @Column({ type: 'int', default: 0 })
  wrongAnswers: number;

  @Column({ type: 'int', default: 0 })
  skippedQuestions: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  marksObtained: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  totalMarks: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentage: number;

  @Column({ default: false })
  isPassed: boolean;

  @Column({ type: 'json', nullable: true })
  timeSpent: {
    questionId: string;
    timeSpent: number; // in seconds
  }[];

  @Column({ type: 'json', nullable: true })
  cheatingDetected: {
    type: string;
    timestamp: Date;
    details: string;
  }[];

  @Column({ type: 'json', nullable: true })
  technicalIssues: {
    type: string;
    timestamp: Date;
    description: string;
    resolved: boolean;
  }[];

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ type: 'json', nullable: true })
  deviceInfo: {
    browser: string;
    os: string;
    screenResolution: string;
    timezone: string;
  };

  @ManyToOne(() => CbtExam, (cbtExam) => cbtExam.attempts)
  @JoinColumn({ name: 'cbtExamId' })
  cbtExam: CbtExam;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
