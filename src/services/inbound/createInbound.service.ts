import { inboundRepository } from '@/repositories/inbound.repository';
import { InboundStatus } from '@/types/inbound.type';

export async function createInbound({ transactionType, transactionId }) {
  const repo = await inboundRepository();

  const inbound = repo.create({
    transactionType,
    transactionId,
    status: InboundStatus.QUEUE_IN,
  });

  return repo.save(inbound);
}
