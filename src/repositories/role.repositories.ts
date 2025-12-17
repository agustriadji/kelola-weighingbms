import { getDb } from '@/database/client';
import { Role } from '@/entities/Role.entity';

export const roleRepository = async () => {
  const db = await getDb();
  return db.getRepository(Role);
};
