import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InboundTicket } from './inboundTicket.entity';

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => InboundTicket)
  @JoinColumn({ name: 'inbound_id' })
  inboundTicket: InboundTicket;

  @Column({ name: 'started_at', type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ name: 'reason', type: 'varchar', length: 200, nullable: true })
  reason: string;
}
