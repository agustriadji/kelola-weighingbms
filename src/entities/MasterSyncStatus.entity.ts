import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("master_sync_status")
export class MasterSyncStatus {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'master_type', type: 'varchar', length: 100 })
  masterType: string; // suppliers, materials

  @Column({ name: 'last_sync_at', type: 'timestamp', nullable: true })
  lastSyncAt: Date;
}
