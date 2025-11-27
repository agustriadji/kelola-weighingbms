import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("master_sync_status")
export class MasterSyncStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  masterType: string; // suppliers, materials

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;
}
