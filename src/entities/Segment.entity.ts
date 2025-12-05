import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Batch } from "./Batch.entity";

@Entity("segments")
export class Segment {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => Batch)
  batch: Batch;

  @Column({ name: 'started_at', type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ name: 'reason', type: 'varchar', length: 200, nullable: true })
  reason: string;
}
