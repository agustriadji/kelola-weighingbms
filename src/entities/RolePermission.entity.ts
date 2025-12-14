import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Permission } from "./Permission.entity";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne("Role", "permissions")
  @JoinColumn({ name: 'role_id' })
  role: any;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
