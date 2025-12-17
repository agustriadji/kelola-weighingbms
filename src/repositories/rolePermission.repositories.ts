import { getDb } from '@/database/client';
import { RolePermission } from '@/entities/RolePermission.entity';

export const driverRepository = async () => {
  const db = await getDb();
  return db.getRepository(RolePermission);
};
