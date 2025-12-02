import { getDb } from '@/database/client';
import { WeighIn } from '@/entities/WeighIn.entity';

export const weighInRepository = async () => {
  const db = await getDb();
  return db.getRepository(WeighIn);
};
