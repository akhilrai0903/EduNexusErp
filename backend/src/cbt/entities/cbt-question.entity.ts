import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { CbtExam } from './cbt-exam.entity';
import { CbtQuestionOption } from './cbt-question-option.entity';
import { QuestionType } from '../enums/question-type.enum';
import { DifficultyLevel } from '../enums/difficulty-level.enum';

@Entity('cbt_questions')
export class CbtQuestion extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare cbtExamId: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficulty: DifficultyLevel;

  @Column({ type: 'int' })
  marks: number;

  @Column({ type: 'int' })
  negativeMarks: number;

  @Column({ type: 'json', nullable: true })
  mediaFiles: {
    type: string; // image, video, audio
    url: string;
    caption?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  correctAnswers: string[];

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => CbtExam, (cbtExam) => cbtExam.questions)
  @JoinColumn({ name: 'cbtExamId' })
  cbtExam: CbtExam;

  @OneToMany(() => CbtQuestionOption, (option) => option.question)
  options: CbtQuestionOption[];
}
