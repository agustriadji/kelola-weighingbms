import { getDb } from '@/database/client';
import { WeighOut } from '@/entities/WeighOut.entity';

export const weighOutRepository = async () => {
  const db = await getDb();
  return db.getRepository(WeighOut);
};
