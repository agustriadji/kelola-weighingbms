import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'sap_id' })
  sapId: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_sync_at' })
  lastSyncAt: Date;
}
