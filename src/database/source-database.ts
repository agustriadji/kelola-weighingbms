import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from "dotenv";

// Import all entities explicitly
import { User } from "../entities/User.entity";
import { Role } from "../entities/Role.entity";
import { Permission } from "../entities/Permission.entity";
import { RolePermission } from "../entities/RolePermission.entity";
import { Batch } from "../entities/Batch.entity";
import { Vehicle } from "../entities/Vehicle.entity";
import { Supplier } from "../entities/Supplier.entity";
import { Material } from "../entities/Material.entity";
import { Driver } from "../entities/Driver.entity";
import { Weighbridge } from "../entities/Weighbridge.entity";
import { Record } from "../entities/Record.entity";
import { Segment } from "../entities/Segment.entity";
import { AuditLog } from "../entities/AuditLog.entity";
import { SyncQueue } from "../entities/SyncQueue.entity";
import { MasterSyncStatus } from "../entities/MasterSyncStatus.entity";

dotenv.config({ path: ".env.local" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USERNAME || "",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "",
  poolSize: 10,
  installExtensions: true,
  synchronize: false,
  logging: false,
  entities: [
    User,
    Role,
    Permission,
    RolePermission,
    Batch,
    Vehicle,
    Supplier,
    Material,
    Driver,
    Weighbridge,
    Record,
    Segment,
    AuditLog,
    SyncQueue,
    MasterSyncStatus
  ],
  migrations: [],
  ssl: process.env.DATABASE_SSL === "true",
});
