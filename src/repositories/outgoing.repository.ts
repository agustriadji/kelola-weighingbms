// incoming_detail
import { getDb } from '@/database/client';
import { OutgoingDetail } from '@/entities/OutgoingDetail.entity';

export const outgoingRepository = async () => {
  const db = await getDb();
  return db.getRepository(OutgoingDetail);
};
