import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("weighbridges")
export class Weighbridge {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'location', type: 'varchar', length: 200 })
  location: string;

  @Column({ name: 'indicator_topic', type: 'varchar', length: 200, nullable: true })
  indicatorTopic: string; // mqtt topic

  @Column({ name: 'config', type: "jsonb", nullable: true })
  config: any;
}
