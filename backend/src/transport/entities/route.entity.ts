import { Entity, Column, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { VehicleRoute } from './vehicle-route.entity';
import { RouteStop } from './route-stop.entity';
import { RouteStatus } from '../enums/route-status.enum';

@Entity('routes')
export class Route extends TenantBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RouteStatus,
    default: RouteStatus.ACTIVE,
  })
  status: RouteStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance: number; // in kilometers

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number; // in minutes

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyFee: number;

  @Column({ type: 'json', nullable: true })
  schedule: {
    startTime: string;
    endTime: string;
    frequency: number; // minutes
    days: string[];
  };

  @Column({ type: 'json', nullable: true })
  pickupPoints: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    time: string;
  }[];

  @Column({ type: 'json', nullable: true })
  dropPoints: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    time: string;
  }[];

  @Column({ type: 'int', default: 0 })
  maxCapacity: number;

  @Column({ type: 'int', default: 0 })
  currentRidership: number;

  @Column({ type: 'json', nullable: true })
  restrictions: {
    gradeLevels?: string[];
    areas?: string[];
    specialRequirements?: string[];
  };

  @Column({ type: 'json', nullable: true })
  emergencyContacts: {
    name: string;
    role: string;
    contactNumber: string;
  }[];

  @Column({ type: 'json', nullable: true })
  safetyMeasures: string[];

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => VehicleRoute, (vehicleRoute) => vehicleRoute.route)
  vehicleRoutes: VehicleRoute[];

  @OneToMany(() => RouteStop, (stop) => stop.route)
  stops: RouteStop[];
}
