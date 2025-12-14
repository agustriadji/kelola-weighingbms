import { weighInRepository } from '@/repositories/weighIn.repository';
import { inboundRepository } from '@/repositories/inbound.repository';
import { getRequestContext } from '@/utils/context';
import { RegisterDocType, InboundStatus } from '@/types/inbound.type';

export const startWeighIn = async (
  inboundId: number,
  requestId?: string,
  miscCategory?: string
) => {
  const weighInRepo = await weighInRepository();
  const inboundRepo = await inboundRepository();
  const context = getRequestContext(requestId);
  const weighingInBy = context.user?.username || 'system';

  const inbound = await inboundRepo.findOne({ where: { id: inboundId } });
  if (!inbound) throw new Error('Inbound not found');

  // Determine weight type based on transaction type and misc category
  let weightType = 'BRUTTO';
  if (inbound.transactionType === RegisterDocType.DISPATCH) {
    weightType = 'TARRA';
  } else if (inbound.transactionType === RegisterDocType.MISCELLANEOUS) {
    if (miscCategory === 'loading') {
      weightType = 'TARRA'; // Like DISPATCH
    } else if (miscCategory === 'unloading') {
      weightType = 'BRUTTO'; // Like RAW_MATERIAL
    } else {
      throw new Error('Miscellaneous category must be specified');
    }
  }

  // create weigh-in record
  const wi = weighInRepo.create({
    inbound: inbound,
    weightType,
  });

  return await weighInRepo.save(wi);
};

export const saveBruttoWeight = async (
  inboundId: number,
  brutto: number,
  cctvUrl?: string,
  user?: any
) => {
  const weighInRepo = await weighInRepository();
  const inboundRepo = await inboundRepository();
  const createdByUser = user || null;

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
  // Keep existing weightType from startWeighIn
  record.cctvUrl = cctvUrl ?? null;
  record.approved = true;
  record.weighingAt = new Date();
  record.stable = true;
  if (createdByUser && createdByUser.id) {
    record.createdBy = createdByUser;
  }

  await weighInRepo.save(record);

  // Update inbound status to YARD
  await inboundRepo.update(inboundId, {
    status: InboundStatus.YARD,
    updatedAt: new Date(),
  });

  return record;
};

export const getBruttoResult = async (inboundId: number) => {
  const weighInRepo = await weighInRepository();
  return await weighInRepo.findOne({
    where: { inbound: { id: inboundId } },
  });
};
