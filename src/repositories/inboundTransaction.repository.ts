import { getDb } from '@/database/client';
import { InboundTransaction } from '@/entities/InboundTransaction.entity';

export const inboundTransactionRepository = async () => {
  const db = await getDb();
  return db.getRepository(InboundTransaction);
};
