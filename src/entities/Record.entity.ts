import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { InboundTicket } from './inboundTicket.entity';
import { Segment } from './Segment.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => InboundTicket)
  batch: InboundTicket;

  @ManyToOne(() => Segment, { nullable: true })
  segment: Segment;

  @Column({ name: 'weight', type: 'float' })
  weight: number;

  @Column({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'stable', type: 'boolean', default: false })
  stable: boolean;

  @Column({ name: 'source', type: 'varchar', length: 50, nullable: true })
  source: string; // mqtt / manual / override
}
