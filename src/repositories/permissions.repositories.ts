import { getDb } from '@/database/client';
import { Permission } from '@/entities/Permission.entity';

export const driverRepository = async () => {
  const db = await getDb();
  return db.getRepository(Permission);
};
