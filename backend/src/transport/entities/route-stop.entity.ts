import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Route } from './route.entity';

@Entity('route_stops')
export class RouteStop extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare routeId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ type: 'time' })
  arrivalTime: string;

  @Column({ type: 'time' })
  departureTime: string;

  @Column({ default: false })
  isPickupPoint: boolean;

  @Column({ default: false })
  isDropPoint: boolean;

  @Column({ default: false })
  isSchoolStop: boolean;

  @Column({ type: 'int', default: 0 })
  waitingTime: number; // in minutes

  @Column({ nullable: true })
  landmarks: string;

  @Column({ nullable: true })
  contactPerson: string;

  @Column({ nullable: true })
  contactNumber: string;

  @Column({ type: 'json', nullable: true })
  facilities: string[];

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Route, (route) => route.stops)
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
