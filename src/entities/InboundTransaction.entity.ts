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
  @PrimaryGeneratedColumn()
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
  @Column({ nullable: true })
  documentType: string; // DO / PO / SJ

  @Column({ nullable: true })
  doNumber: string;

  @Column({ nullable: true })
  poNumber: string;

  @Column({ nullable: true })
  sjNumber: string;

  // --- Seal & Checklist ---
  @Column({ nullable: true })
  sealNumber: string;

  @Column({ nullable: true })
  sealRange: string;

  @Column({ nullable: true })
  sealCondition: string; // ok / broken / missing

  @Column({ default: false })
  doorLocked: boolean;

  @Column({ default: false })
  noLeakage: boolean;

  @Column({ default: false })
  loadVisible: boolean;

  // --- Entry Time ---
  @CreateDateColumn()
  entryTime: Date;

  // --- Status ---
  @Column({
    default: 'waiting-weighin',
  })
  status: string; // waiting-weighin | cancelled | completed
}
