import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('outgoing_detail')
export class OutgoingDetail {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'rfid', type: 'text', nullable: true })
  rfid: string;

  @Column({ name: 'vehicle_number', type: 'text' })
  vehicleNumber: string;

  @Column({ name: 'driver_name', type: 'text' })
  driverName: string;

  @Column({ name: 'driver_id', type: 'text' })
  driverId: string;

  @Column({ name: 'transporter', type: 'text' })
  transporter: string;

  @Column({ name: 'contract_number', type: 'text', nullable: true })
  contractNumber: string;

  @Column({ name: 'relation_name', type: 'text', nullable: true })
  relationName: string;

  @Column({ name: 'material', type: 'text', nullable: true })
  material: string;

  @Column({ name: 'do_number', type: 'text', nullable: true })
  doNumber: string;

  @Column({ name: 'si_number', type: 'text', nullable: true })
  siNumber: string;

  @Column({ name: 'container_number', type: 'text', nullable: true })
  containerNumber: string;

  @Column({ name: 'vessel_name', type: 'text', nullable: true })
  vesselName: string;

  @Column({ name: 'certificate', type: 'text', nullable: true })
  certificate: string;

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

  @Column({ name: 'vehicle_type', type: 'text' })
  vehicleType: string;
}
