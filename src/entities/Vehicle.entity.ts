import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("vehicles")
export class Vehicle {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'plate', type: 'varchar', length: 50, unique: true })
  plate: string;

  @Column({ name: 'type', type: 'varchar', length: 100, nullable: true })
  type: string;

  @Column({ name: 'owner', type: 'varchar', length: 200, nullable: true })
  owner: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
