import { Entity, Column, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Staff } from './staff.entity';

@Entity('departments')
export class Department extends TenantBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  shortName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  headId: string;

  @Column({ type: 'int', default: 0 })
  budget: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  responsibilities: string[];

  @Column({ type: 'json', nullable: true })
  objectives: string[];

  @OneToMany(() => Staff, (staff) => staff.department)
  staff: Staff[];
}
