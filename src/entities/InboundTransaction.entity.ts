import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Vehicle } from './Vehicle.entity';
import { Supplier } from './Supplier.entity';
import { Material } from './Material.entity';
import { Driver } from './Driver.entity';

@Entity()
export class InboundTransaction {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  // --- Vehicle & Driver ---
  @ManyToOne(() => Vehicle, { eager: true })
  vehicle: Vehicle;

  @ManyToOne(() => Driver, { eager: true })
  driver: Driver;

  // --- Supplier & Material ---
  @ManyToOne(() => Supplier, { eager: true })
  supplier: Supplier;

  @ManyToOne(() => Material, { eager: true })
  material: Material;

  // --- Document Information ---
  @Column({ name: 'document_type', type: 'varchar', nullable: true })
  documentType: string; // DO / PO / SJ

  @Column({ name: 'do_number', type: 'varchar', nullable: true })
  doNumber: string;

  @Column({ name: 'po_number', type: 'varchar', nullable: true })
  poNumber: string;

  @Column({ name: 'sj_number', type: 'varchar', nullable: true })
  sjNumber: string;

  // --- Seal & Checklist ---
  @Column({ name: 'seal_number', type: 'varchar', nullable: true })
  sealNumber: string;

  @Column({ name: 'seal_range', type: 'varchar', nullable: true })
  sealRange: string;

  @Column({ name: 'seal_condition', type: 'varchar', nullable: true })
  sealCondition: string; // ok / broken / missing

  @Column({ name: 'door_locked', type: 'boolean', default: false })
  doorLocked: boolean;

  @Column({ name: 'no_leakage', type: 'boolean', default: false })
  noLeakage: boolean;

  @Column({ name: 'load_visible', type: 'boolean', default: false })
  loadVisible: boolean;

  // --- Entry Time ---
  @CreateDateColumn({ name: 'entry_time', type: 'timestamp' })
  entryTime: Date;

  // --- Status ---
  @Column({
    name: 'status',
    type: 'varchar',
    default: 'waiting-weighin',
  })
  status: string; // waiting-weighin | cancelled | completed
}
