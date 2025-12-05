import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'sim', type: 'varchar', length: 50, nullable: true })
  sim: string;
}
