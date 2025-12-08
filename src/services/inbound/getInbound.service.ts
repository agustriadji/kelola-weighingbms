import { inboundRepository } from '@/repositories/inbound.repository';
import { RegisterDocType } from '@/types/inbound.type';

export async function getInboundList(type?: RegisterDocType) {
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
