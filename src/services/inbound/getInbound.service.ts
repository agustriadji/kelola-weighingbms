import { inboundRepository } from '@/repositories/inbound.repository';

export async function getInboundList(type?: 'INCOMING' | 'OUTGOING' | 'MISC') {
  const repo = await inboundRepository();

  return repo.find({
    where: type ? { transactionType: type } : {},
    order: { id: 'DESC' },
  });
}

export async function getInboundDetail(id: number) {
  const repo = await inboundRepository();

  return repo.findOne({
    where: { id },
  });
}
