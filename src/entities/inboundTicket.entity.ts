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
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: ['INCOMING', 'OUTGOING', 'MISC'],
  })
  transactionType: 'INCOMING' | 'OUTGOING' | 'MISC';

  @Column({ name: 'transaction_id', type: 'int' })
  transactionId: number; // FK ke incoming_detail/outgoing_detail/misc_detail

  @Column({
    name: 'status',
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
