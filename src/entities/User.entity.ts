import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 150, name: 'full_name' })
  fullName: string;

  @ManyToOne("Role", "users")
  @JoinColumn({ name: 'role_id' })
  role: any;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
  lastLogin: Date;
}
