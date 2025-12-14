import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('weigh_out')
export class WeighOut {
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

  @Column({ name: 'netto', type: 'double precision', nullable: true })
  netto: number;

  @Column({ name: 'expected_netto', type: 'double precision', nullable: true })
  expectedNetto: number;

  @Column({ name: 'shrinkage_value', type: 'double precision', nullable: true })
  shrinkageValue: number;

  @Column({ name: 'shrinkage_percent', type: 'double precision', nullable: true })
  shrinkagePercent: number;

  @Column({ name: 'warning_flag', type: 'boolean', default: false })
  warningFlag: boolean;

  @Column({ name: 'cctv_url', type: 'text', nullable: true })
  cctvUrl: string;

  @Column({ name: 'status', type: 'text', default: 'closing' })
  status: string;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'weighing_at', type: 'timestamp', nullable: true })
  weighingAt: Date;
}
