// incoming_detail
import { getDb } from '@/database/client';
import { IncomingDetail } from '@/entities/IncomingDetail.entity';

export const incomingRepository = async () => {
  const db = await getDb();
  return db.getRepository(IncomingDetail);
};
