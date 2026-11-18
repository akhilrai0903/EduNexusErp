import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class TenantBaseEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  schoolId: string;
}
