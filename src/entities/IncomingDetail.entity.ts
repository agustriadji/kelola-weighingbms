// incoming-detail.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('incoming_detail')
export class IncomingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, name: 'rfid' }) rfid: string;

  @Column({ type: 'varchar', name: 'vehicle_number' }) vehicleNumber: string;
  @Column({ type: 'varchar', name: 'vehicle_type' }) vehicleType: string;
  @Column({ type: 'varchar', name: 'driver_name' }) driverName: string;
  @Column({ type: 'varchar', name: 'driver_id' }) driverId: string;
  @Column({ type: 'varchar', name: 'container_number' }) containerNumber: string;
  @Column({ type: 'varchar', name: 'transporter' }) transporter: string;

  @Column({ type: 'varchar', name: 'po_number', nullable: true }) poNumber: string;
  @Column({ type: 'varchar', name: 'contract_number', nullable: true }) contractNumber: string;
  @Column({ type: 'varchar', name: 'supplier', nullable: true }) supplier: string;
  @Column({ type: 'varchar', name: 'material', nullable: true }) material: string;
  @Column({ type: 'varchar', name: 'mill_original', nullable: true }) millOriginal: string;
  @Column({ type: 'varchar', name: 'do_number', nullable: true }) doNumber: string;
  @Column({ type: 'varchar', name: 'certificate', nullable: true }) certificate: string;

  @Column({ type: 'varchar', name: 'spb_number', nullable: true }) spbNumber: string;
  @Column({ type: 'varchar', name: 'spb_date', nullable: true }) spbDate: string;

  @Column({ type: 'varchar', name: 'bc_type', nullable: true }) bcType: string;
  @Column({ type: 'varchar', name: 'bc_number', nullable: true }) bcNumber: string;
  @Column({ type: 'varchar', name: 'bc_status', nullable: true }) bcStatus: string;

  @Column({ type: 'varchar', name: 'seal_number', nullable: true }) sealNumber: string;

  @Column({ type: 'varchar', name: 'ffa', nullable: true }) ffa: string;
  @Column({ type: 'varchar', name: 'moist', nullable: true }) moist: string;
  @Column({ type: 'varchar', name: 'impurity', nullable: true }) impurity: string;

  @Column({ type: 'varchar', name: 'status', nullable: true }) status: string;
  @Column({ type: 'varchar', name: 'created_by', nullable: true }) createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
