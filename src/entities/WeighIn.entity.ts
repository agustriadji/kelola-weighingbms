import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class WeighIn {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne('InboundTicket', (it: any) => it.weighInRecords)
  @JoinColumn({ name: 'inbound_id' })
  inboundId: any;

  @Column({ name: 'weight', type: 'float', nullable: true })
  weight: number; // sebelumnya 'brutto'

  @Column({
    name: 'weight_type',
    type: 'enum',
    enum: ['BRUTTO', 'TARRA'],
  })
  weightType: 'BRUTTO' | 'TARRA';

  @CreateDateColumn({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date; // sebelumnya 'bruttoTime'

  @Column({ name: 'cctv_url', type: 'varchar', nullable: true })
  cctvUrl: string; // sebelumnya cctvBruttoUrl

  @Column({ name: 'stable', type: 'boolean', default: false })
  stable: boolean;

  @Column({ name: 'approved', type: 'boolean', default: false })
  approved: boolean;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;
}
