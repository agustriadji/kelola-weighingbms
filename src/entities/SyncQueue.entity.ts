import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("sync_queue")
export class SyncQueue {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'payload', type: 'jsonb' })
  payload: any;

  @Column({ name: 'type', type: 'varchar', length: 100 })
  type: string; // e.g., "post-weigh", "sync-master"

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ name: 'tries', type: 'integer', default: 0 })
  tries: number;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt: Date;
}
