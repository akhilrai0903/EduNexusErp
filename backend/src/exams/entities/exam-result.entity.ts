import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Exam } from './exam.entity';
import { Student } from '../../sis/entities/student.entity';
import { Grade } from '../enums/grade.enum';

@Entity('exam_results')
export class ExamResult extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare examId: string;

  @Column({ type: 'uuid' })
  declare studentId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  marksObtained: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalMarks: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({
    type: 'enum',
    enum: Grade,
    nullable: true,
  })
  grade: Grade;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  gradePoints: number;

  @Column({ default: false })
  isPassed: boolean;

  @Column({ nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  subjectWiseMarks: {
    subjectId: string;
    subjectName: string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  questionWiseMarks: {
    questionNumber: number;
    marksObtained: number;
    totalMarks: number;
    feedback?: string;
  }[];

  @Column({ type: 'int', nullable: true })
  rank: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  classAverage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  classHighest: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  classLowest: number;

  @Column({ default: false })
  isAbsent: boolean;

  @Column({ nullable: true })
  absenceReason: string;

  @Column({ default: false })
  isMalpractice: boolean;

  @Column({ nullable: true })
  malpracticeDetails: string;

  @Column({ type: 'timestamp', nullable: true })
  resultPublishedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  publishedBy: string;

  @Column({ type: 'json', nullable: true })
  teacherComments: {
    teacherId: string;
    teacherName: string;
    comment: string;
    timestamp: Date;
  }[];

  @ManyToOne(() => Exam, (exam) => exam.results)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
