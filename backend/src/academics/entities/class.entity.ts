import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { AcademicYear } from './academic-year.entity';
import { Student } from '../../sis/entities/student.entity';
import { ClassSection } from './class-section.entity';
import { Subject } from './subject.entity';

@Entity('classes')
export class Class extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare academicYearId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  maxStudents: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  fees: number;

  @Column({ type: 'json', nullable: true })
  gradeLevel: {
    level: number;
    category: string;
  };

  @Column({ type: 'json', nullable: true })
  requirements: {
    minimumAge?: number;
    prerequisites?: string[];
    documents?: string[];
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  settings: {
    attendanceRequired?: boolean;
    homeworkWeight?: number;
    examWeight?: number;
    projectWeight?: number;
  };

  @ManyToOne(() => AcademicYear, (academicYear) => academicYear.classes)
  @JoinColumn({ name: 'academicYearId' })
  academicYear: AcademicYear;

  @OneToMany(() => Student, (student) => student.currentClass)
  students: Student[];

  @OneToMany(() => ClassSection, (section) => section.class)
  sections: ClassSection[];

  @OneToMany(() => Subject, (subject) => subject.class)
  subjects: Subject[];
}
