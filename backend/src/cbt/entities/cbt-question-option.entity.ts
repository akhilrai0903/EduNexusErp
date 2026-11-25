import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { CbtQuestion } from './cbt-question.entity';

@Entity('cbt_question_options')
export class CbtQuestionOption extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare questionId: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ type: 'json', nullable: true })
  mediaFiles: {
    type: string; // image, video, audio
    url: string;
    caption?: string;
  }[];

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => CbtQuestion, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question: CbtQuestion;
}
