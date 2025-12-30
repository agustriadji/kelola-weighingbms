import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Import all entities explicitly
import { User } from '../entities/User.entity';
import { Role } from '../entities/Role.entity';
import { Permission } from '../entities/Permission.entity';
import { RolePermission } from '../entities/RolePermission.entity';
import { Vehicle } from '../entities/Vehicle.entity';
import { Supplier } from '../entities/Supplier.entity';
import { Material } from '../entities/Material.entity';
import { Driver } from '../entities/Driver.entity';
import { Weighbridge } from '../entities/Weighbridge.entity';
import { Record } from '../entities/Record.entity';
import { Segment } from '../entities/Segment.entity';
import { AuditLog } from '../entities/AuditLog.entity';
import { SyncQueue } from '../entities/SyncQueue.entity';
import { MasterSyncStatus } from '../entities/MasterSyncStatus.entity';
import { WeighIn } from '../entities/WeighIn.entity';
import { WeighOut } from '../entities/WeighOut.entity';
import { InboundTicket } from '../entities/inboundTicket.entity';
import { IncomingDetail } from '../entities/IncomingDetail.entity';
import { OutgoingDetail } from '../entities/OutgoingDetail.entity';
import { MiscDetail } from '../entities/MiscDetail.entity';
import { HwGeneralApi } from '../entities/HwGeneralApi.entity';
import { HwConfiguration } from '../entities/HwConfiguration.entity';

dotenv.config({ path: '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'wbms_user',
  password: process.env.DB_PASSWORD || 'wbms_password',
  database: process.env.DB_NAME || 'wbms_db',
  poolSize: 20,
  maxQueryExecutionTime: 5000,
  installExtensions: true,
  synchronize: false,
  logging: false,
  cache: {
    type: 'database',
    tableName: 'query_result_cache',
    duration: 30000, // 30 seconds cache
  },
  extra: {
    connectionLimit: 20,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
  },
  entities: [
    User,
    Role,
    Permission,
    RolePermission,
    Vehicle,
    Supplier,
    Material,
    Driver,
    Weighbridge,
    Record,
    Segment,
    AuditLog,
    SyncQueue,
    MasterSyncStatus,
    WeighIn,
    WeighOut,
    InboundTicket,
    IncomingDetail,
    OutgoingDetail,
    MiscDetail,
    HwConfiguration,
    HwGeneralApi,
  ],
  migrations: [],
  ssl: process.env.DATABASE_SSL === 'true',
});
