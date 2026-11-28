import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Vehicle } from './vehicle.entity';
import { MaintenanceType } from '../enums/maintenance-type.enum';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';

@Entity('vehicle_maintenance')
export class VehicleMaintenance extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  declare vehicleId: string;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;

  @Column({ type: 'date' })
  scheduledDate: Date;

  @Column({ type: 'date', nullable: true })
  completedDate: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  mileageAtService: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ nullable: true })
  serviceProvider: string;

  @Column({ nullable: true })
  serviceLocation: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  workPerformed: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  performedBy: string; // Staff member or external service provider

  @Column({ type: 'json', nullable: true })
  partsReplaced: {
    name: string;
    partNumber: string;
    quantity: number;
    cost: number;
  }[];

  @Column({ type: 'json', nullable: true })
  fluidsChanged: {
    type: string;
    brand: string;
    quantity: number;
    cost: number;
  }[];

  @Column({ type: 'date', nullable: true })
  nextServiceDue: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  nextServiceMileage: number;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.maintenanceRecords)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;
}
