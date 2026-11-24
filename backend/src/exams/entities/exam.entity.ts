import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { AcademicYear } from '../../academics/entities/academic-year.entity';
import { Class } from '../../academics/entities/class.entity';
import { Subject } from '../../academics/entities/subject.entity';
import { ExamType } from '../enums/exam-type.enum';
import { ExamStatus } from '../enums/exam-status.enum';
import { ExamSchedule } from './exam-schedule.entity';
import { ExamResult } from './exam-result.entity';

@Entity('exams')
export class Exam extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare academicYearId: string;

  @Column({ type: 'uuid' })
  declare classId: string;

  @Column({ type: 'uuid', nullable: true })
  declare subjectId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ExamType,
  })
  type: ExamType;

  @Column({
    type: 'enum',
    enum: ExamStatus,
    default: ExamStatus.SCHEDULED,
  })
  status: ExamStatus;

  @Column({ type: 'date' })
  examDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int' })
  duration: number; // in minutes

  @Column({ type: 'int' })
  totalMarks: number;

  @Column({ type: 'int' })
  passMarks: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weightage: number;

  @Column({ default: false })
  isCompulsory: boolean;

  @Column({ default: false })
  allowRetake: boolean;

  @Column({ type: 'json', nullable: true })
  instructions: string[];

  @Column({ type: 'json', nullable: true })
  questionPattern: {
    type: string;
    count: number;
    marks: number;
  }[];

  @Column({ type: 'json', nullable: true })
  gradingCriteria: {
    grade: string;
    minPercentage: number;
    maxPercentage: number;
    points: number;
  }[];

  @Column({ type: 'json', nullable: true })
  settings: {
    allowCalculator?: boolean;
    allowDictionary?: boolean;
    allowReferenceMaterials?: boolean;
    randomizeQuestions?: boolean;
    showResultsImmediately?: boolean;
  };

  @ManyToOne(() => AcademicYear)
  @JoinColumn({ name: 'academicYearId' })
  academicYear: AcademicYear;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @OneToMany(() => ExamSchedule, (schedule) => schedule.exam)
  schedules: ExamSchedule[];

  @OneToMany(() => ExamResult, (result) => result.exam)
  results: ExamResult[];
}
