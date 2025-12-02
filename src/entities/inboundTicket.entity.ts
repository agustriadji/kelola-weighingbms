// inbound-ticket.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  //ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { WeighIn } from './WeighIn.entity';
import { WeighOut } from './WeighOut.entity';

@Entity('inbound_ticket')
export class InboundTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['INCOMING', 'OUTGOING', 'MISC'],
    name: 'transaction_type',
  })
  transactionType: 'INCOMING' | 'OUTGOING' | 'MISC';

  @Column({ type: 'int', name: 'transaction_id' })
  transactionId: number; // FK ke incoming_detail/outgoing_detail/misc_detail

  @Column({
    type: 'enum',
    enum: [
      'registered',
      'queue-weigh-in',
      'weighing-in',
      'weighed-in',
      'yard-processing',
      'queue-weigh-out',
      'weighing-out',
      'weighed-out',
      'finished',
    ],
    name: 'status',
    default: 'queue-weigh-in',
  })
  status: string;

  @OneToOne(() => WeighIn)
  @JoinColumn({ name: 'weigh_in_id' })
  weighIn: WeighIn;

  @Column({ name: 'weigh_in_id', type: 'int', nullable: true })
  weighInId: number;

  @OneToOne(() => WeighOut)
  @JoinColumn({ name: 'weigh_out_id' })
  weighOut: WeighOut;

  @Column({ name: 'weigh_out_id', type: 'int', nullable: true })
  weighOutId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
