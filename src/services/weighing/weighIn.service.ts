import { weighInRepository } from '@/repositories/weighIn.repository';
import { inboundRepository } from '@/repositories/inbound.repository';
import { getRequestContext } from '@/utils/context';
import { RegisterDocType } from '@/types/inbound.type';

const weighInRepo = await weighInRepository();
const inboundRepo = await inboundRepository();

export const startWeighIn = async (inboundId: number, requestId?: string) => {
  const context = getRequestContext(requestId);
  const weighingInBy = context.user?.username || 'system';

  const inbound = await inboundRepo.findOne({ where: { id: inboundId } });
  if (!inbound) throw new Error('Inbound not found');

  // create weigh-in record
  const wi = weighInRepo.create({
    inbound,
    weightType: inbound.transactionType !== RegisterDocType.DISPATCH ? 'BRUTTO' : 'TARRA',
  });

  return await weighInRepo.save(wi);
};

export const saveBruttoWeight = async (inboundId: number, brutto: number, cctvUrl?: string) => {
  const inbound = await inboundRepo.findOne({
    where: { id: inboundId },
    relations: ['weighOut', 'weighIn'],
    select: {
      id: true,
      transactionId: true,
      transactionType: true,
      status: true,
      weighIn: {
        id: true,
        weight: true,
        weightType: true,
        cctvUrl: true,
        approved: true,
        timestamp: true,
        stable: true,
      },
    },
  });

  if (!inbound) throw new Error('Inbound not found');

  const record = await weighInRepo.findOne({
    where: { id: inbound?.weighIn.id },
  });
  if (!record) throw new Error('Weigh-In record not initialized');

  record.weight = brutto;
  record.weightType = 'BRUTTO';
  record.cctvUrl = cctvUrl ?? null;
  record.approved = true;
  record.timestamp = new Date();
  record.stable = true;

  await weighInRepo.save(record);

  return record;
};

export const getBruttoResult = async (inboundId: number) => {
  return await weighInRepo.findOne({
    where: { inbound: { id: inboundId } },
  });
};
