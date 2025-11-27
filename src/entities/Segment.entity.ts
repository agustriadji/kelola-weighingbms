import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Batch } from "./Batch.entity";

@Entity("segments")
export class Segment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Batch)
  batch: Batch;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  reason: string;
}
