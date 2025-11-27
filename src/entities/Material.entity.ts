import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("materials")
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ name: 'sap_id', type: 'varchar', length: 100, nullable: true })
  sapId: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  uom: string;

  @Column({ name: 'last_sync_at', type: 'timestamp', nullable: true })
  lastSyncAt: Date;
}
