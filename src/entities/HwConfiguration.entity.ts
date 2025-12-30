import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

export enum HwAreaEnum {
  REGISTERING = 'REGISTERING',
  WEIGHING_IN = 'WEIGHING-IN',
  WEIGHING_OUT = 'WEIGHING-OUT'
}

export interface HwDataConfig {
  gate?: number | null;
  camera?: number | null;
  lamp?: number | null;
  mqtt?: {
    topic_get_weight?: string | null;
    topic_post_command?: string | null;
  } | null;
}

@Entity("hw_configuration")
export class HwConfiguration {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ 
    name: 'area', 
    type: 'enum', 
    enum: HwAreaEnum,
    nullable: true 
  })
  area: HwAreaEnum | null;

  @Column({ 
    name: 'data_config', 
    type: 'jsonb',
    nullable: true 
  })
  dataConfig: HwDataConfig | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}