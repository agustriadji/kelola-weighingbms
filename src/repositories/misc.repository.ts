// incoming_detail
import { getDb } from '@/database/client';
import { MiscDetail } from '@/entities/MiscDetail.entity';

export const MiscRepository = async () => {
  const db = await getDb();
  return db.getRepository(MiscDetail);
};
