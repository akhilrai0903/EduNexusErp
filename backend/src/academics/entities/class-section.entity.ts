import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Class } from './class.entity';

@Entity('class_sections')
export class ClassSection extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare classId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortName: string;

  @Column({ type: 'int', default: 0 })
  maxStudents: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  settings: {
    roomNumber?: string;
    capacity?: number;
    equipment?: string[];
  };

  @ManyToOne(() => Class, (cls) => cls.sections)
  @JoinColumn({ name: 'classId' })
  class: Class;
}
