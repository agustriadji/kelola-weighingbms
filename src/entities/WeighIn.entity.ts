import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class WeighIn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('InboundTicket', (it: any) => it.weighInRecords)
  inbound: any;

  @Column({ type: 'float', nullable: true })
  weight: number; // sebelumnya 'brutto'

  @Column({
    type: 'enum',
    enum: ['BRUTTO', 'TARRA'],
  })
  weightType: 'BRUTTO' | 'TARRA';

  @CreateDateColumn()
  timestamp: Date; // sebelumnya 'bruttoTime'

  @Column({ type: 'varchar', nullable: true })
  cctvUrl: string; // sebelumnya cctvBruttoUrl

  @Column({ type: 'boolean', default: false })
  stable: boolean;

  @Column({ type: 'boolean', default: false })
  approved: boolean;
}
