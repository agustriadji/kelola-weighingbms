// misc-detail.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('misc_detail')
export class MiscDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'rfid', nullable: true }) rfid: string;

  @Column({ type: 'varchar', name: 'vehicle_number', nullable: true }) vehicleNumber: string;
  @Column({ type: 'varchar', name: 'vehicle_type', nullable: true }) vehicleType: string;
  @Column({ type: 'varchar', name: 'driver_name', nullable: true }) driverName: string;
  @Column({ type: 'varchar', name: 'driver_id', nullable: true }) driverId: string;
  @Column({ type: 'varchar', name: 'container_number', nullable: true }) containerNumber: string;
  @Column({ type: 'varchar', name: 'transporter', nullable: true }) transporter: string;

  @Column({ type: 'varchar', name: 'do_number', nullable: true }) doNumber: string;
  @Column({ type: 'varchar', name: 'po_number', nullable: true }) poNumber: string;
  @Column({ type: 'varchar', name: 'contract_number', nullable: true }) contractNumber: string;
  @Column({ type: 'varchar', name: 'material', nullable: true }) material: string;
  @Column({ type: 'varchar', name: 'supplier', nullable: true }) supplier: string;

  @Column({ type: 'varchar', name: 'bc_type', nullable: true }) bcType: string;
  @Column({ type: 'varchar', name: 'bc_number', nullable: true }) bcNumber: string;

  @Column({ type: 'varchar', name: 'seal_number', nullable: true }) sealNumber: string;

  @Column({ type: 'varchar', name: 'status', nullable: true }) status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
