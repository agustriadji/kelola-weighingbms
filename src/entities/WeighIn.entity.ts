import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('weigh_in')
export class WeighIn {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne("InboundTicket")
  @JoinColumn({ name: 'inbound_id' })
  inbound: any;

  @Column({ name: 'weight', type: 'double precision', nullable: true })
  weight: number;

  @Column({ name: 'weight_type', type: 'varchar' })
  weightType: string;

  @Column({ name: 'timestamp', type: 'timestamp', default: () => 'now()' })
  timestamp: Date;

  @Column({ name: 'cctv_url', type: 'text', nullable: true })
  cctvUrl: string;

  @Column({ name: 'stable', type: 'boolean', default: false })
  stable: boolean;

  @Column({ name: 'approved', type: 'boolean', default: false })
  approved: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'weighing_at', type: 'timestamp', nullable: true })
  weighingAt: Date;
}
