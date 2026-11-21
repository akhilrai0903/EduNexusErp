import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Class } from './class.entity';
import { SubjectType } from '../enums/subject-type.enum';
import { SubjectCategory } from '../enums/subject-category.enum';

@Entity('subjects')
export class Subject extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare classId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortName: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SubjectType,
    default: SubjectType.CORE,
  })
  type: SubjectType;

  @Column({
    type: 'enum',
    enum: SubjectCategory,
    default: SubjectCategory.ACADEMIC,
  })
  category: SubjectCategory;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  credits: number;

  @Column({ type: 'int', default: 0 })
  maxMarks: number;

  @Column({ type: 'int', default: 0 })
  passMarks: number;

  @Column({ type: 'json', nullable: true })
  gradingScale: {
    grade: string;
    minMarks: number;
    maxMarks: number;
    points: number;
  }[];

  @Column({ type: 'json', nullable: true })
  assessmentWeights: {
    homework?: number;
    quiz?: number;
    midterm?: number;
    final?: number;
    project?: number;
    attendance?: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  syllabus: {
    topics: string[];
    objectives: string[];
    resources: string[];
  };

  @ManyToOne(() => Class, (cls) => cls.subjects)
  @JoinColumn({ name: 'classId' })
  class: Class;
}
