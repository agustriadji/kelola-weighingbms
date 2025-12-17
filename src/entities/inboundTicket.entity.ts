import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WeighIn } from './WeighIn.entity';
import { WeighOut } from './WeighOut.entity';
import { User } from './User.entity';

@Entity('inbound_ticket')
export class InboundTicket {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'transaction_type', type: 'varchar' })
  transactionType: string;

  @Column({ name: 'transaction_id', type: 'int' })
  transactionId: number;

  @Column({ name: 'status', type: 'varchar', default: 'registered' })
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'remark', type: 'varchar', length: 200, nullable: true })
  remark: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
