import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany("User", "role")
  users: any[];

  @OneToMany("RolePermission", "role")
  permissions: any[];
}
