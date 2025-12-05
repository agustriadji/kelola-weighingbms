import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WeighIn } from './WeighIn.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'entity', type: 'varchar', length: 100 })
  entity: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 50 })
  entityId: string;

  @Column({ name: 'action', type: 'varchar', length: 50 })
  action: string;

  @Column({ name: 'payload', type: 'jsonb' })
  payload: any;

  @ManyToOne('User')
  user: any;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => WeighIn, { nullable: true })
  weighIn: WeighIn;
}
