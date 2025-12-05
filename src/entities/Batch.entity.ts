import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from './Supplier.entity';
import { Material } from './Material.entity';
import { Vehicle } from './Vehicle.entity';
import { User } from './User.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'batch_name' })
  batchName: string;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'status', type: 'varchar', length: 50 })
  status: string; // pending, ongoing, finished

  @Column({ type: 'timestamp', nullable: true, name: 'ended_at' })
  endedAt: Date;

  @Column({ type: 'float', nullable: true, name: 'expected_netto' })
  expectedNetto: number;

  @Column({ type: 'float', nullable: true, name: 'actual_netto' })
  actualNetto: number;

  @Column({ type: 'float', nullable: true, name: 'shrinkage_value' })
  shrinkageValue: number;

  @Column({ type: 'float', nullable: true, name: 'shrinkage_percent' })
  shrinkagePercent: number;

  @Column({ type: 'boolean', nullable: true, name: 'warning_flag' })
  warningFlag: boolean;
}
