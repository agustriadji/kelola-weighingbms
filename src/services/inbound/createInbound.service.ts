import { inboundRepository } from '@/repositories/inbound.repository';
import { InboundStatus } from '@/types/inbound.type';

export async function createInbound({ transactionType, transactionId, statusInbound }) {
  const repo = await inboundRepository();

  const inbound = repo.create({
    transactionType,
    transactionId,
    status: statusInbound?.toLowerCase() || InboundStatus.QUEUE_IN,
  });

  return repo.save(inbound);
}
