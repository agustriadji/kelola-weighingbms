import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InboundTicket } from './inboundTicket.entity';
import { Segment } from './Segment.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => InboundTicket)
  @JoinColumn({ name: 'inbound_id' })
  inboundTicket: InboundTicket;

  @ManyToOne(() => Segment)
  @JoinColumn({ name: 'segment_id' })
  segment: Segment;

  @Column({ name: 'weight', type: 'double precision' })
  weight: number;

  @Column({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'stable', type: 'boolean', default: false })
  stable: boolean;

  @Column({ name: 'source', type: 'varchar', length: 50, nullable: true })
  source: string;
}
