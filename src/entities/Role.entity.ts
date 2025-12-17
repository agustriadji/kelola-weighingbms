import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RolePermission } from "./RolePermission.entity";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ name: 'fullname', type: 'varchar', length: 200, nullable: true })
  fullname: string;

  @OneToMany("User", "role")
  users: any[];

  @OneToMany(() => RolePermission, (rp) => rp.role)
  permissions: RolePermission[];
}
