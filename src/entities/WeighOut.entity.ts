import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class WeighOut {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('InboundTicket', (it: any) => it.weighOutRecords)
  inbound: any;

  @Column({ type: 'float', nullable: true })
  weight: number; // sebelumnya 'tarra'

  @Column({
    type: 'enum',
    enum: ['BRUTTO', 'TARRA'],
  })
  weightType: 'BRUTTO' | 'TARRA';

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'float', nullable: true })
  netto: number;

  @Column({ type: 'float', nullable: true })
  expectedNetto: number;

  @Column({ type: 'float', nullable: true })
  shrinkageValue: number;

  @Column({ type: 'float', nullable: true })
  shrinkagePercent: number;

  @Column({ type: 'boolean', default: false })
  warningFlag: boolean;

  @Column({ type: 'varchar', nullable: true })
  cctvUrl: string;

  @Column({
    type: 'varchar',
    default: 'closing',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
