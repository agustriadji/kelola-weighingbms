import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('misc_detail')
export class MiscDetail {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'rfid', type: 'text', nullable: true })
  rfid: string;

  @Column({ name: 'po_number', type: 'text', nullable: true })
  poNumber: string;

  @Column({ name: 'contract_number', type: 'text', nullable: true })
  contractNumber: string;

  @Column({ name: 'supplier', type: 'text', nullable: true })
  supplier: string;

  @Column({ name: 'material', type: 'text', nullable: true })
  material: string;

  @Column({ name: 'do_number', type: 'text', nullable: true })
  doNumber: string;

  @Column({ name: 'vehicle_number', type: 'text' })
  vehicleNumber: string;

  @Column({ name: 'vehicle_type', type: 'text', nullable: true })
  vehicleType: string;

  @Column({ name: 'container_number', type: 'text', nullable: true })
  containerNumber: string;

  @Column({ name: 'driver_name', type: 'text' })
  driverName: string;

  @Column({ name: 'driver_id', type: 'text', nullable: true })
  driverId: string;

  @Column({ name: 'transporter', type: 'text' })
  transporter: string;

  @Column({ name: 'bc_type', type: 'text', nullable: true })
  bcType: string;

  @Column({ name: 'bc_number', type: 'text', nullable: true })
  bcNumber: string;

  @Column({ name: 'seal_number', type: 'text', nullable: true })
  sealNumber: string;

  @Column({ name: 'status', type: 'text', nullable: true })
  status: string;

  @Column({ name: 'created_by', type: 'text', nullable: true })
  createdBy: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @Column({ name: 'relation_name', type: 'varchar', length: 100, nullable: true })
  relationName: string;
}
