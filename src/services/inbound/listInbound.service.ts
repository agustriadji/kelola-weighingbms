import { inboundRepository } from '@/repositories/inbound.repository';

export async function listInbound(options?: { type?: string; status?: string }) {
  const repo = await inboundRepository();

  const where: any = {};

  if (options?.type) {
    where.transactionType = options.type.toUpperCase();
  }

  if (options?.status) {
    where.status = options.status;
  }

  return repo.find({
    where,
    order: { id: 'DESC' },
  });
}
