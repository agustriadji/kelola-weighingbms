import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("materials")
export class Material {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'code', type: 'varchar', length: 50 })
  code: string;

  @Column({ name: 'description', type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ name: 'sap_id', type: 'varchar', length: 100, nullable: true })
  sapId: string;

  @Column({ name: 'uom', type: 'varchar', length: 20, nullable: true })
  uom: string;

  @Column({ name: 'last_sync_at', type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
