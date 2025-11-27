import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Batch } from "./Batch.entity";
import { Segment } from "./Segment.entity";

@Entity("records")
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Batch)
  batch: Batch;

  @ManyToOne(() => Segment, { nullable: true })
  segment: Segment;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'boolean', default: false })
  stable: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string; // mqtt / manual / override
}
