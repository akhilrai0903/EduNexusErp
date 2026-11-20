import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { School } from './school.entity';
import { Subscription } from './subscription.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  subdomain: string;

  @Column()
  domain: string;

  @Column()
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  favicon: string;

  @Column({ type: 'json', nullable: true })
  branding: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    customCss?: string;
  };

  @Column({ type: 'json', nullable: true })
  settings: {
    timezone?: string;
    dateFormat?: string;
    currency?: string;
    language?: string;
    features?: string[];
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ default: false })
  isTrialActive: boolean;

  @OneToMany(() => School, (school) => school.tenant)
  schools: School[];

  @OneToMany(() => Subscription, (subscription) => subscription.tenant)
  subscriptions: Subscription[];
}
