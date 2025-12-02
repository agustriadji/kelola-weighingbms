import { getDb } from '@/database/client';
import { InboundTicket } from '@/entities/inboundTicket.entity';

export const inboundRepository = async () => {
  const db = await getDb();
  return db.getRepository(InboundTicket);
};
