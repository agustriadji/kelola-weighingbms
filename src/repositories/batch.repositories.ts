import { getDb } from '@/database/client';
import { inboundRepository } from '@/repositories/inbound.repository';

export const batchRepository = async () => {
  const db = await getDb();
  return db.getRepository(inboundRepository);
};
