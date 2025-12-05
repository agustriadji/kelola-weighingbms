import { inboundRepository } from '@/repositories/inbound.repository';

export async function updateInboundStatus(id, status) {
  const repo = await inboundRepository();

  await repo.update(id, { status });

  return repo.findOne({ where: { id } });
}

export async function attachWeighIn(inboundId, weighInId) {
  const repo = await inboundRepository();
  return repo.update(inboundId, { weighInId });
}

export async function attachWeighOut(inboundId, weighOutId) {
  const repo = await inboundRepository();
  return repo.update(inboundId, { weighOutId });
}
