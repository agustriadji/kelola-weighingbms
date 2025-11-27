import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("sync_queue")
export class SyncQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column({ type: 'varchar', length: 100 })
  type: string; // e.g., "post-weigh", "sync-master"

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'integer', default: 0 })
  tries: number;

  @Column({ type: 'text', nullable: true })
  lastError: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;
}
