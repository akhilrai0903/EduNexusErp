import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Vehicle } from './vehicle.entity';
import { Route } from './route.entity';

@Entity('vehicle_routes')
export class VehicleRoute extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare vehicleId: string;

  @Column({ type: 'uuid' })
  declare routeId: string;

  @Column({ type: 'date' })
  assignedDate: Date;

  @Column({ type: 'date', nullable: true })
  unassignedDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  assignedBy: string; // Staff member who assigned

  @Column({ nullable: true })
  unassignedBy: string; // Staff member who unassigned

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.routes)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @ManyToOne(() => Route, (route) => route.vehicleRoutes)
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
