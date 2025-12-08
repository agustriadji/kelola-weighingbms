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
import { InboundStatus, RegisterDocType } from '../types/inbound.type';

@Entity('inbound_ticket')
export class InboundTicket {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: [RegisterDocType.RAW_MATERIAL, RegisterDocType.DISPATCH, RegisterDocType.MISCELLANEOUS],
  })
  transactionType:
    | RegisterDocType.RAW_MATERIAL
    | RegisterDocType.DISPATCH
    | RegisterDocType.MISCELLANEOUS;

  @Column({ name: 'transaction_id', type: 'int' })
  transactionId: number; // FK ke incoming_detail/outgoing_detail/misc_detail

  @Column({
    name: 'status',
    type: 'enum',
    enum: [
      InboundStatus.REGISTERED,
      InboundStatus.QUEUE_IN,
      InboundStatus.WEIGHING_IN,
      InboundStatus.WEIGHED_IN,
      InboundStatus.YARD,
      InboundStatus.QUEUE_OUT,
      InboundStatus.WEIGHING_OUT,
      InboundStatus.WEIGHED_OUT,
      InboundStatus.FINISHED,
    ],
    default: InboundStatus.QUEUE_IN,
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
