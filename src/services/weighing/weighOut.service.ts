import { weighOutRepository } from '@/repositories/weighOut.repository';
import { inboundRepository } from '@/repositories/inbound.repository';
import { getRequestContext } from '@/utils/context';
import { calculateShrinkage } from '../shared/shrinkage.util';
import { RegisterDocType, InboundStatus } from '@/types/inbound.type';

export const startWeighOut = async (inboundId: number, miscCategory?: string) => {
  const inboundRepo = await inboundRepository();
  const weighOutRepo = await weighOutRepository();

  const inbound = await inboundRepo.findOne({ where: { id: inboundId } });
  if (!inbound) throw new Error('Inbound not found');

  // Determine weight type based on transaction type and misc category
  let weightType = 'TARRA';
  if (inbound.transactionType === RegisterDocType.DISPATCH) {
    weightType = 'BRUTTO';
  } else if (inbound.transactionType === RegisterDocType.MISCELLANEOUS) {
    if (miscCategory === 'loading') {
      weightType = 'BRUTTO'; // Like DISPATCH
    } else if (miscCategory === 'unloading') {
      weightType = 'TARRA'; // Like RAW_MATERIAL
    } else {
      throw new Error('Miscellaneous category must be specified');
    }
  }

  const wo = weighOutRepo.create({
    inbound,
    weightType,
  });
  return await weighOutRepo.save(wo);
};

export const saveTarraWeight = async (
  inboundId: number,
  weight: number,
  cctvUrl?: string,
  user?: any
) => {
  const inboundRepo = await inboundRepository();
  const weighOutRepo = await weighOutRepository();
  const createdByUser = user || null;

  const inbound = await inboundRepo.findOne({
    where: { id: inboundId },
    relations: ['weighOut', 'weighIn'],
  });

  if (!inbound) throw new Error('Inbound not found');

  const we = inbound.weighOut;
  if (!we) throw new Error('Weigh-Out record not initialized');

  // Determine brutto and tarra based on weight types
  let brutto, tarra, netto;

  if (we.weightType === 'BRUTTO') {
    // DISPATCH case: weighOut is BRUTTO, weighIn is TARRA
    brutto = weight;
    tarra = inbound.weighIn?.weight || 0;
    netto = brutto - tarra;
  } else {
    // RAW_MATERIAL case: weighOut is TARRA, weighIn is BRUTTO
    brutto = inbound.weighIn?.weight || 0;
    tarra = weight;
    netto = brutto - tarra;
  }

  // shrinkage calculation
  const expected = we.expectedNetto ?? netto; // fallback if needed
  const shrinkage = calculateShrinkage(expected, netto);

  // update weigh-out
  we.weight = weight;
  we.cctvUrl = cctvUrl ?? null;
  we.netto = netto;
  we.expectedNetto = expected;
  we.shrinkageValue = shrinkage.shrinkageValue;
  we.shrinkagePercent = shrinkage.shrinkagePercent;
  we.warningFlag = shrinkage.warning;
  we.weighingAt = new Date();
  if (createdByUser && createdByUser.id) {
    we.createdBy = createdByUser;
  }

  await weighOutRepo.save(we);

  // Update inbound status to FINISHED
  await inboundRepo.update(inboundId, {
    status: InboundStatus.FINISHED,
    updatedAt: new Date(),
  });

  return {
    brutto,
    tarra,
    netto,
    shrinkage,
  };
};

export const getFinalResult = async (inboundId: number) => {
  const weighOutRepo = await weighOutRepository();
  return await weighOutRepo.findOne({
    where: { inbound: { id: inboundId } },
  });
};
