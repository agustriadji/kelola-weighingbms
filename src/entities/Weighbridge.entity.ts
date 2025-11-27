import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("weighbridges")
export class Weighbridge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  location: string;

  @Column({ name: 'indicator_topic', type: 'varchar', length: 200, nullable: true })
  indicatorTopic: string; // mqtt topic

  @Column({ type: "jsonb", nullable: true })
  config: any;
}
