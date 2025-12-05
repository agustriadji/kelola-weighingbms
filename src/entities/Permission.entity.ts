import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 150, unique: true })
  name: string;
}
