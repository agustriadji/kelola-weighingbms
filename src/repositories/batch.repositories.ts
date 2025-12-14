import { getDb } from '@/database/client';
import { Batch } from '@/entities/Batch.entity';

export const batchRepository = async () => {
  const db = await getDb();
  return db.getRepository(Batch);
};
