// outgoing-detail.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('outgoing_detail')
export class OutgoingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true }) rfid: string;

  @Column({ type: 'varchar', name: 'vehicle_number', nullable: true }) vehicleNumber: string;
  @Column({ type: 'varchar', name: 'vehicle_type', nullable: true }) vehicleType: string;
  @Column({ type: 'varchar', nullable: true, name: 'driver_name' }) driverName: string;
  @Column({ type: 'varchar', name: 'transporter' }) transporter: string;
  @Column({ type: 'varchar', name: 'container_number', nullable: true }) containerNumber: string;

  @Column({ type: 'varchar', nullable: true, name: 'contract_number' }) contractNumber: string;
  @Column({ type: 'varchar', nullable: true, name: 'relation_name' }) relationName: string;
  @Column({ type: 'varchar', nullable: true, name: 'material' }) material: string;

  @Column({ type: 'varchar', nullable: true, name: 'do_number' }) doNumber: string;
  @Column({ type: 'varchar', nullable: true, name: 'si_number' }) siNumber: string;

  @Column({ type: 'varchar', nullable: true, name: 'vessel_name' }) vesselName: string;
  @Column({ type: 'varchar', nullable: true, name: 'certificate' }) certificate: string;
  @Column({ type: 'varchar', nullable: true, name: 'seal_number' }) sealNumber: string;
  @Column({ type: 'varchar', nullable: true, name: 'status' }) status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
