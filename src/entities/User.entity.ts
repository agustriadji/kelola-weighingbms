import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @ManyToOne("Role", "users")
  @JoinColumn({ name: 'role_id' })
  role: any;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date;
}
