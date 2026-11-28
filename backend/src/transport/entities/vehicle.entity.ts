import { Entity, Column, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { VehicleRoute } from './vehicle-route.entity';
import { VehicleMaintenance } from './vehicle-maintenance.entity';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';

@Entity('vehicles')
export class Vehicle extends TenantBaseEntity {
  @Column()
  registrationNumber: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  engineNumber: string;

  @Column({ nullable: true })
  chassisNumber: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;

  @Column({ nullable: true })
  insuranceNumber: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiry: Date;

  @Column({ nullable: true })
  permitNumber: string;

  @Column({ type: 'date', nullable: true })
  permitExpiry: Date;

  @Column({ type: 'date', nullable: true })
  fitnessExpiry: Date;

  @Column({ type: 'json', nullable: true })
  features: string[];

  @Column({ type: 'json', nullable: true })
  safetyEquipment: {
    name: string;
    quantity: number;
    expiryDate?: Date;
    lastChecked?: Date;
  }[];

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  mileage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelCapacity: number;

  @Column({ type: 'json', nullable: true })
  driver: {
    id: string;
    name: string;
    licenseNumber: string;
    contactNumber: string;
  };

  @Column({ type: 'json', nullable: true })
  conductor: {
    id: string;
    name: string;
    contactNumber: string;
  };

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => VehicleRoute, (route) => route.vehicle)
  routes: VehicleRoute[];

  @OneToMany(() => VehicleMaintenance, (maintenance) => maintenance.vehicle)
  maintenanceRecords: VehicleMaintenance[];
}
