import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WeighIn } from './WeighIn.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  entity: string;

  @Column({ type: 'varchar', length: 50 })
  entityId: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @ManyToOne('User')
  user: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => WeighIn, { nullable: true })
  weighIn: WeighIn;
}
