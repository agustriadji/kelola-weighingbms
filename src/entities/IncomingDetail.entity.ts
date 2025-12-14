import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('incoming_detail')
export class IncomingDetail {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'rfid', type: 'text', nullable: true })
  rfid: string;

  @Column({ name: 'vehicle_number', type: 'text' })
  vehicleNumber: string;

  @Column({ name: 'driver_name', type: 'text' })
  driverName: string;

  @Column({ name: 'transporter', type: 'text' })
  transporter: string;

  @Column({ name: 'po_number', type: 'text', nullable: true })
  poNumber: string;

  @Column({ name: 'contract_number', type: 'text', nullable: true })
  contractNumber: string;

  @Column({ name: 'supplier', type: 'text', nullable: true })
  supplier: string;

  @Column({ name: 'material', type: 'text', nullable: true })
  material: string;

  @Column({ name: 'mill_original', type: 'text', nullable: true })
  millOriginal: string;

  @Column({ name: 'do_number', type: 'text', nullable: true })
  doNumber: string;

  @Column({ name: 'spb_number', type: 'text', nullable: true })
  spbNumber: string;

  @Column({ name: 'spb_date', type: 'text', nullable: true })
  spbDate: string;

  @Column({ name: 'ffa', type: 'text', nullable: true })
  ffa: string;

  @Column({ name: 'moist', type: 'text', nullable: true })
  moist: string;

  @Column({ name: 'impurity', type: 'text', nullable: true })
  impurity: string;

  @Column({ name: 'bc_type', type: 'text', nullable: true })
  bcType: string;

  @Column({ name: 'bc_number', type: 'text', nullable: true })
  bcNumber: string;

  @Column({ name: 'certificate', type: 'text', nullable: true })
  certificate: string;

  @Column({ name: 'status', type: 'text', nullable: true })
  status: string;

  @Column({ name: 'created_by', type: 'text', nullable: true })
  createdBy: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @Column({ name: 'driver_id', type: 'text' })
  driverId: string;

  @Column({ name: 'bc_status', type: 'text', nullable: true })
  bcStatus: string;

  @Column({ name: 'vehicle_type', type: 'text' })
  vehicleType: string;

  @Column({ name: 'container_number', type: 'text', nullable: true })
  containerNumber: string;

  @Column({ name: 'seal_number', type: 'text', nullable: true })
  sealNumber: string;
}
