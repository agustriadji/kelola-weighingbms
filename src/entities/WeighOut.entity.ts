import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';

@Entity()
export class WeighOut {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne('InboundTicket', (it: any) => it.weighOutRecords)
  @JoinColumn({ name: 'inbound_id' })
  inbound: any;

  @Column({ name: 'weight', type: 'float', nullable: true })
  weight: number; // sebelumnya 'tarra'

  @Column({
    name: 'weight_type',
    type: 'enum',
    enum: ['BRUTTO', 'TARRA'],
  })
  weightType: 'BRUTTO' | 'TARRA';

  @CreateDateColumn({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'netto', type: 'float', nullable: true })
  netto: number;

  @Column({ name: 'expected_netto', type: 'float', nullable: true })
  expectedNetto: number;

  @Column({ name: 'shrinkage_value', type: 'float', nullable: true })
  shrinkageValue: number;

  @Column({ name: 'shrinkage_percent', type: 'float', nullable: true })
  shrinkagePercent: number;

  @Column({ name: 'warning_flag', type: 'boolean', default: false })
  warningFlag: boolean;

  @Column({ name: 'cctv_url', type: 'varchar', nullable: true })
  cctvUrl: string;

  @Column({
    name: 'status',
    type: 'varchar',
    default: 'closing',
  })
  status: string;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;
}
