import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
