import { inboundRepository } from '@/repositories/inbound.repository';

export async function createInbound({ transactionType, transactionId }) {
  const repo = await inboundRepository();

  const inbound = repo.create({
    transactionType,
    transactionId,
    status: 'queue-weigh-in',
  });

  return repo.save(inbound);
}
