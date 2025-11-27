import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne("Role")
  @JoinColumn({ name: 'role_id' })
  role: any;

  @ManyToOne("Permission")
  @JoinColumn({ name: 'permission_id' })
  permission: any;
}
